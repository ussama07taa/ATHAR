<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewOrderMail;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\PromoCode;
use App\Support\ShippingCalculator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    /**
     * POST /api/orders
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name'          => 'required|string|max:255',
            'customer_phone'         => 'required|string|max:30',
            'customer_city'          => 'required|string|max:100',
            'customer_address'       => 'nullable|string|max:255',
            'customer_quartier'      => 'required|string|max:100',
            'promo_code'             => 'nullable|string|max:50',
            'items'                  => 'required|array|min:1',
            'items.*.variant_id'     => 'required|integer|exists:product_variants,id',
            'items.*.quantity'       => 'required|integer|min:1|max:99',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $variantIds = collect($validated['items'])->pluck('variant_id')->unique()->values();

            $variants = ProductVariant::query()
                ->with('product')
                ->whereIn('id', $variantIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($variants->count() !== $variantIds->count()) {
                throw ValidationException::withMessages([
                    'items' => 'Un ou plusieurs articles ne sont plus disponibles.',
                ]);
            }

            $subtotal  = 0;
            $lineItems = [];

            foreach ($validated['items'] as $index => $item) {
                $variant = $variants[$item['variant_id']];
                $product = $variant->product;

                if (! $product || ! $product->is_active) {
                    throw ValidationException::withMessages([
                        "items.{$index}.variant_id" => "« {$variant->size} » n'est plus disponible à la vente.",
                    ]);
                }

                if ($variant->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        "items.{$index}.quantity" => $variant->stock > 0
                            ? "Stock insuffisant pour « {$product->name} » ({$variant->size}) : {$variant->stock} restant(s)."
                            : "« {$product->name} » ({$variant->size}) est en rupture de stock.",
                    ]);
                }

                $unitPrice = (float) $variant->price;
                $subtotal += $unitPrice * $item['quantity'];

                $lineItems[] = [
                    'product_variant_id' => $item['variant_id'],
                    'quantity'           => $item['quantity'],
                    'unit_price'         => $unitPrice,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ];
            }

            $subtotal = round($subtotal, 2);
            $discount = 0;
            $promo    = null;

            if (! empty($validated['promo_code'])) {
                $promo = PromoCode::findValid($validated['promo_code']);

                if (! $promo) {
                    throw ValidationException::withMessages([
                        'promo_code' => 'Code promo invalide.',
                    ]);
                }

                $promo->assertUsable($subtotal);
                $discount = $promo->calculateDiscount($subtotal);
            }

            $afterDiscount = max(0, round($subtotal - $discount, 2));
            $shipping      = ShippingCalculator::calculate($afterDiscount);
            $totalAmount   = round($afterDiscount + $shipping['shipping_amount'], 2);

            $order = Order::create([
                'order_number'      => 'ATH-' . strtoupper(Str::random(8)),
                'customer_name'     => strip_tags($validated['customer_name']),
                'customer_phone'    => strip_tags($validated['customer_phone']),
                'customer_city'     => strip_tags($validated['customer_city']),
                'customer_address'  => isset($validated['customer_address']) ? strip_tags($validated['customer_address']) : null,
                'customer_quartier' => strip_tags($validated['customer_quartier']),
                'subtotal_amount'   => $subtotal,
                'discount_amount'   => $discount,
                'shipping_amount'   => $shipping['shipping_amount'],
                'promo_code'        => $promo?->code,
                'total_amount'      => $totalAmount,
                'status'            => 'pending',
                'stock_adjusted'    => true,
            ]);

            foreach ($validated['items'] as $item) {
                $variants[$item['variant_id']]->decrement('stock', $item['quantity']);
            }

            if ($promo) {
                $promo->increment('used_count');
            }

            $lineItems = array_map(fn ($li) => array_merge($li, ['order_id' => $order->id]), $lineItems);
            DB::table('order_items')->insert($lineItems);

            // Clean up abandoned cart
            \App\Models\AbandonedCart::where('customer_phone', preg_replace('/\D/', '', $validated['customer_phone']))->delete();

            return $order;
        });

        $this->notifyAdmin($order);

        return response()->json([
            'message'          => 'Order placed successfully.',
            'order_number'     => $order->order_number,
            'subtotal_amount'  => $order->subtotal_amount,
            'discount_amount'  => $order->discount_amount,
            'shipping_amount'  => $order->shipping_amount,
            'total_amount'     => $order->total_amount,
            'status'           => $order->status,
            'whatsapp_url'     => $this->whatsappConfirmationUrl($order),
        ], 201);
    }

    /**
     * POST /api/orders/abandoned
     */
    public function abandoned(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_phone' => 'required|string|max:30',
            'customer_name'  => 'nullable|string|max:255',
            'items'          => 'nullable|array',
        ]);

        // Clean phone number for consistency
        $phone = preg_replace('/\D/', '', $validated['customer_phone']);

        \App\Models\AbandonedCart::updateOrCreate(
            ['customer_phone' => $phone],
            [
                'customer_name' => $validated['customer_name'] ?? null,
                'payload' => $validated['items'],
                'updated_at' => now(), // explicitly touch to bubble it up
            ]
        );

        return response()->json(['message' => 'Cart captured.']);
    }

    /**
     * GET /api/orders/track
     */
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_number' => 'required|string|max:50',
            'phone'        => 'required|string|max:30',
        ]);

        $phone = preg_replace('/\D/', '', $validated['phone']);

        $order = Order::query()
            ->where('order_number', strtoupper(trim($validated['order_number'])))
            ->with(['items.variant.product'])
            ->first();

        if (! $order) {
            throw ValidationException::withMessages([
                'order_number' => 'Commande introuvable.',
            ]);
        }

        $orderPhone = preg_replace('/\D/', '', $order->customer_phone);

        if (! str_ends_with($orderPhone, substr($phone, -9)) && $orderPhone !== $phone) {
            throw ValidationException::withMessages([
                'phone' => 'Numéro de téléphone incorrect pour cette commande.',
            ]);
        }

        $statusLabels = [
            'pending'   => 'En attente',
            'confirmed' => 'Confirmée',
            'shipped'   => 'Expédiée',
            'delivered' => 'Livrée',
            'cancelled' => 'Annulée',
        ];

        return response()->json([
            'order_number'    => $order->order_number,
            'status'          => $order->status,
            'status_label'    => $statusLabels[$order->status] ?? $order->status,
            'customer_name'   => $order->customer_name,
            'customer_city'   => $order->customer_city,
            'subtotal_amount' => $order->subtotal_amount,
            'discount_amount' => $order->discount_amount,
            'shipping_amount' => $order->shipping_amount,
            'total_amount'    => $order->total_amount,
            'promo_code'      => $order->promo_code,
            'created_at'      => $order->created_at?->toIso8601String(),
            'items'           => $order->items->map(fn ($item) => [
                'product'  => $item->variant?->product?->name,
                'size'     => $item->variant?->size,
                'quantity' => $item->quantity,
                'price'    => $item->unit_price,
            ]),
        ]);
    }

    private function notifyAdmin(Order $order): void
    {
        $email = config('athar.admin_email');

        if (! $email) {
            return;
        }

        try {
            Mail::to($email)->send(new NewOrderMail($order));
        } catch (\Throwable $e) {
            Log::warning('Order notification email failed: ' . $e->getMessage(), [
                'order_id' => $order->id,
            ]);
        }
    }

    private function whatsappConfirmationUrl(Order $order): string
    {
        $whatsapp = config('athar.contact.whatsapp', '212661234567');
        $message  = rawurlencode(
            "Salam, j'ai passé la commande {$order->order_number} sur Athar. Total: {$order->total_amount} MAD. Merci !"
        );

        return "https://wa.me/{$whatsapp}?text={$message}";
    }
}

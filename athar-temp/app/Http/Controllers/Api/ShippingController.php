<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\PromoCode;
use App\Support\ShippingCalculator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ShippingController extends Controller
{
    /**
     * POST /api/shipping/calculate
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'promo_code'           => 'nullable|string|max:50',
            'items'                => 'required|array|min:1',
            'items.*.variant_id'   => 'required|integer|exists:product_variants,id',
            'items.*.quantity'     => 'required|integer|min:1|max:99',
        ]);

        $subtotal = $this->calculateSubtotal($validated['items']);
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

        return response()->json([
            'subtotal'         => $subtotal,
            'discount'         => $discount,
            'promo_code'       => $promo?->code,
            'promo_label'      => $promo?->label,
            'shipping_amount'  => $shipping['shipping_amount'],
            'shipping_is_free' => $shipping['is_free'],
            'free_threshold'   => $shipping['free_threshold'],
            'total'            => round($afterDiscount + $shipping['shipping_amount'], 2),
        ]);
    }

    /**
     * GET /api/shipping/config
     */
    public function config(): JsonResponse
    {
        return response()->json([
            'free_threshold' => (float) config('athar.shipping.free_threshold', 500),
            'fee'            => (float) config('athar.shipping.fee', 35),
        ]);
    }

    /** @param array<int, array{variant_id: int, quantity: int}> $items */
    private function calculateSubtotal(array $items): float
    {
        $variantIds = collect($items)->pluck('variant_id')->unique();
        $prices     = ProductVariant::whereIn('id', $variantIds)->pluck('price', 'id');
        $subtotal   = 0;

        foreach ($items as $item) {
            $subtotal += (float) $prices[$item['variant_id']] * $item['quantity'];
        }

        return round($subtotal, 2);
    }
}

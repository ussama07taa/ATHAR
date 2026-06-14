<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\PromoCode;
use App\Support\ShippingCalculator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PromoCodeController extends Controller
{
    /**
     * POST /api/promo/validate
     */
    public function validateCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code'                 => 'required|string|max:50',
            'items'                => 'required|array|min:1',
            'items.*.variant_id'   => 'required|integer|exists:product_variants,id',
            'items.*.quantity'     => 'required|integer|min:1|max:99',
        ]);

        $subtotal = $this->calculateSubtotal($validated['items']);

        $promo = PromoCode::findValid($validated['code']);

        if (! $promo) {
            throw ValidationException::withMessages([
                'code' => 'Code promo invalide.',
            ]);
        }

        $promo->assertUsable($subtotal);
        $discount      = $promo->calculateDiscount($subtotal);
        $afterDiscount = max(0, round($subtotal - $discount, 2));
        $shipping      = ShippingCalculator::calculate($afterDiscount);

        return response()->json([
            'code'            => $promo->code,
            'label'           => $promo->label,
            'subtotal'        => $subtotal,
            'discount'        => $discount,
            'shipping_amount' => $shipping['shipping_amount'],
            'total'           => round($afterDiscount + $shipping['shipping_amount'], 2),
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

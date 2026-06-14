<?php

namespace App\Support;

class ShippingCalculator
{
    /** @return array{shipping_amount: float, is_free: bool, free_threshold: float, fee: float} */
    public static function calculate(float $subtotalAfterDiscount): array
    {
        $threshold = (float) config('athar.shipping.free_threshold', 500);
        $fee       = (float) config('athar.shipping.fee', 35);
        $shipping  = $subtotalAfterDiscount >= $threshold ? 0.0 : $fee;

        return [
            'shipping_amount' => $shipping,
            'is_free'         => $shipping === 0.0,
            'free_threshold'  => $threshold,
            'fee'             => $fee,
        ];
    }
}

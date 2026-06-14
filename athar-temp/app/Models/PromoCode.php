<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class PromoCode extends Model
{
    public const TYPE_PERCENTAGE = 'percentage';
    public const TYPE_FIXED = 'fixed';

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'max_uses',
        'used_count',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value'            => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_uses'         => 'integer',
        'used_count'       => 'integer',
        'is_active'        => 'boolean',
        'starts_at'        => 'datetime',
        'expires_at'       => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (PromoCode $promo) {
            $promo->code = strtoupper(trim($promo->code));
        });
    }

    public static function findValid(string $code): ?self
    {
        return static::query()
            ->where('code', strtoupper(trim($code)))
            ->where('is_active', true)
            ->first();
    }

    public function assertUsable(float $subtotal): void
    {
        if (! $this->is_active) {
            throw ValidationException::withMessages([
                'promo_code' => 'Ce code promo n\'est plus actif.',
            ]);
        }

        if ($this->starts_at && now()->lt($this->starts_at)) {
            throw ValidationException::withMessages([
                'promo_code' => 'Ce code promo n\'est pas encore valide.',
            ]);
        }

        if ($this->expires_at && now()->gt($this->expires_at)) {
            throw ValidationException::withMessages([
                'promo_code' => 'Ce code promo a expiré.',
            ]);
        }

        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            throw ValidationException::withMessages([
                'promo_code' => 'Ce code promo a atteint sa limite d\'utilisation.',
            ]);
        }

        if ($this->min_order_amount !== null && $subtotal < (float) $this->min_order_amount) {
            throw ValidationException::withMessages([
                'promo_code' => 'Montant minimum : ' . number_format((float) $this->min_order_amount, 0, ',', ' ') . ' MAD.',
            ]);
        }
    }

    public function calculateDiscount(float $subtotal): float
    {
        $discount = $this->type === self::TYPE_FIXED
            ? (float) $this->value
            : round($subtotal * ((float) $this->value / 100), 2);

        return min($discount, $subtotal);
    }

    public function getLabelAttribute(): string
    {
        return $this->type === self::TYPE_FIXED
            ? number_format((float) $this->value, 0, ',', ' ') . ' MAD'
            : rtrim(rtrim(number_format((float) $this->value, 2, '.', ''), '0'), '.') . '%';
    }
}

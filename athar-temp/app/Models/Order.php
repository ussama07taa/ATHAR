<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_phone',
        'customer_city',
        'customer_address',
        'customer_quartier',
        'subtotal_amount',
        'discount_amount',
        'shipping_amount',
        'promo_code',
        'total_amount',
        'status',
        'stock_adjusted',
    ];

    protected $casts = [
        'total_amount'    => 'decimal:2',
        'subtotal_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'stock_adjusted'  => 'boolean',
    ];

    protected static function booted(): void
    {
        static::updating(function (Order $order) {
            if (! $order->isDirty('status')) {
                return;
            }

            $oldStatus = $order->getOriginal('status');
            $newStatus = $order->status;

            if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled' && $order->stock_adjusted) {
                $order->restoreStock();
                $order->stock_adjusted = false;
            }

            if ($oldStatus === 'cancelled' && $newStatus !== 'cancelled' && ! $order->stock_adjusted) {
                $order->reserveStock();
                $order->stock_adjusted = true;
            }
        });
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function restoreStock(): void
    {
        DB::transaction(function () {
            $this->loadMissing('items');

            foreach ($this->items as $item) {
                ProductVariant::where('id', $item->product_variant_id)
                    ->lockForUpdate()
                    ->increment('stock', $item->quantity);
            }
        });
    }

    public function reserveStock(): void
    {
        DB::transaction(function () {
            $this->loadMissing('items');

            foreach ($this->items as $item) {
                $variant = ProductVariant::where('id', $item->product_variant_id)
                    ->lockForUpdate()
                    ->first();

                if ($variant && $variant->stock >= $item->quantity) {
                    $variant->decrement('stock', $item->quantity);
                }
            }
        });
    }
}

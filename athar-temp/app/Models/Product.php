<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'brand',
        'slug',
        'description',
        'meta_title',
        'meta_description',
        'is_pack',
        'is_custom_pack',
        'pack_slots',
        'gender',
        'is_niche',
        'is_active',
        'image',
        'badge_label',
        'badge_color',
    ];

    protected $casts = [
        'is_pack'        => 'boolean',
        'is_custom_pack' => 'boolean',
        'pack_slots'     => 'integer',
        'is_niche'       => 'boolean',
        'is_active' => 'boolean',
        'gallery'   => 'array',
    ];

    protected $appends = ['image_url', 'gallery_urls'];

    public function getImageUrlAttribute()
    {
        return $this->image ? config('app.url') . '/storage/' . $this->image : null;
    }

    public function getGalleryUrlsAttribute()
    {
        if (!$this->gallery) return [];
        return array_map(function ($path) {
            return config('app.url') . '/storage/' . $path;
        }, $this->gallery);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function bundleProducts()
    {
        return $this->belongsToMany(Product::class, 'bundle_product', 'bundle_id', 'product_id');
    }

    public function relatedProducts()
    {
        return $this->belongsToMany(Product::class, 'product_related', 'product_id', 'related_id');
    }

    public function getFrontendUrlAttribute(): string
    {
        return rtrim(config('athar.frontend_url'), '/') . '/products/' . $this->slug;
    }

    public function scopeLowStock($query, int $threshold = 5)
    {
        return $query->whereHas('variants', fn ($q) => $q->where('stock', '<=', $threshold));
    }

    public function scopeIncomplete($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('image')
                ->orWhere('image', '')
                ->orWhereNull('brand')
                ->orWhere('brand', '')
                ->orDoesntHave('variants');
        });
    }

    public function isIncomplete(): bool
    {
        return blank($this->image)
            || blank($this->brand)
            || $this->variants()->count() === 0;
    }

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            // Packs skip category validation as they are a collection of multiple categories
            if ($product->is_pack) {
                return;
            }

            if ($product->category_id === null) {
                throw new \InvalidArgumentException('La catégorie est obligatoire pour chaque produit.');
            }

            $category = Category::find($product->category_id);

            if (! $category || ! $category->isAssignable()) {
                throw new \InvalidArgumentException(
                    'Le produit doit être assigné à un type de parfum (catégorie finale).',
                );
            }
        });
    }
}

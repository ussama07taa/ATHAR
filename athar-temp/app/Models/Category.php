<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    /** @var list<string> Core slugs that must not be deleted or reparented. */
    public const PROTECTED_SLUGS = [
        'parfums',
        'femmes',
        'hommes',
    ];

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'image',
        'description',
        'color',
        'sort_order',
        'is_visible',
        'is_featured',
        'featured_sort_order',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'is_visible'          => 'boolean',
        'is_featured'         => 'boolean',
        'sort_order'          => 'integer',
        'featured_sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::deleting(function (Category $category) {
            if ($category->isProtected()) {
                throw new \RuntimeException(
                    "La catégorie « {$category->name} » est protégée et ne peut pas être supprimée.",
                );
            }
        });

        static::updating(function (Category $category) {
            if ($category->isProtected() && $category->isDirty(['slug', 'parent_id'])) {
                throw new \RuntimeException(
                    "La catégorie « {$category->name} » est protégée : le slug et le parent ne peuvent pas être modifiés.",
                );
            }
        });
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('sort_order');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scope: only visible collections, ordered by sort_order
     */
    public function scopeVisible($query)
    {
        return $query->where('is_visible', true)->orderBy('sort_order');
    }

    /**
     * Scope: top-level categories (no parent)
     */
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope: leaf categories (no children)
     */
    public function scopeLeaf($query)
    {
        return $query->whereDoesntHave('children');
    }

    /**
     * Scope: homepage featured collection cards
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->orderBy('featured_sort_order');
    }

    /**
     * Categories belonging to the Parfums navigation tree.
     */
    public function scopeInParfumsTree($query)
    {
        return $query->where(function ($q) {
            $q->whereIn('slug', ['parfums', 'femmes', 'hommes'])
                ->orWhere('slug', 'like', 'femmes-%')
                ->orWhere('slug', 'like', 'hommes-%');
        });
    }

    /**
     * Homepage / legacy collection cards (not Parfums nav).
     */
    public function scopeHomeCollections($query)
    {
        return $query->whereNotIn('slug', ['parfums', 'femmes', 'hommes', 'collections'])
            ->where(function ($q) {
                $q->where('slug', 'not like', 'femmes-%')
                    ->where('slug', 'not like', 'hommes-%')
                    ->where('slug', 'not like', 'col-%');
            });
    }

    public function isInParfumsTree(): bool
    {
        if (in_array($this->slug, ['parfums', 'femmes', 'hommes'], true)) {
            return true;
        }

        return str_starts_with($this->slug, 'femmes-')
            || str_starts_with($this->slug, 'hommes-');
    }

    /**
     * Resolve category IDs for product filtering (handles grouped slugs).
     *
     * @return int[]|null
     */
    public static function resolveFilterIds(string $slug): ?array
    {
        $category = static::where('slug', $slug)->where('is_visible', true)->first();

        return $category ? $category->getDescendantIds(visibleOnly: true) : null;
    }

    /**
     * Root ancestor slug (parfums | collections | null)
     */
    public function getRootSlug(): ?string
    {
        $ancestors = $this->getAncestors();

        return $ancestors[0]->slug ?? ($this->parent_id === null ? $this->slug : null);
    }

    /**
     * Get all descendant category IDs (including self).
     */
    public function getDescendantIds(bool $visibleOnly = false): array
    {
        $ids = [$this->id];

        $query = static::query()->where('parent_id', $this->id);

        if ($visibleOnly) {
            $query->where('is_visible', true);
        }

        foreach ($query->get() as $child) {
            $ids = array_merge($ids, $child->getDescendantIds($visibleOnly));
        }

        return array_values(array_unique($ids));
    }

    /**
     * Get breadcrumb path from root to this category
     */
    public function getAncestors(): array
    {
        $ancestors = [];
        $current = $this->parent;

        while ($current) {
            array_unshift($ancestors, $current);
            $current = $current->parent;
        }

        return $ancestors;
    }

    /**
     * Full path label for admin display (e.g. "Femmes › Eau de parfum")
     */
    public function getFullPathAttribute(): string
    {
        $parts = array_map(
            fn ($a) => $a->name,
            array_filter($this->getAncestors(), fn ($a) => ! in_array($a->slug, ['parfums', 'collections'], true))
        );
        $parts[] = $this->name;

        return implode(' › ', $parts);
    }

    /**
     * Whether this category is part of the core Parfums tree structure.
     */
    public function isProtected(): bool
    {
        return in_array($this->slug, self::PROTECTED_SLUGS, true);
    }

    /**
     * Whether products can be assigned directly to this category
     */
    public function isAssignable(): bool
    {
        return $this->is_visible
            && ! $this->children()->where('is_visible', true)->exists();
    }

    /**
     * Univers ID for the product form (Femmes/Hommes or top-level leaf)
     */
    public function getGenderParentId(): ?int
    {
        if ($this->parent && in_array($this->parent->slug, ['femmes', 'hommes', 'col-femmes', 'col-hommes'], true)) {
            return $this->parent_id;
        }

        return null;
    }

    /**
     * Product line for admin form: parfums | collections
     */
    public function getProductLine(): ?string
    {
        $root = $this->getRootSlug();

        return in_array($root, ['parfums', 'collections'], true) ? $root : null;
    }
}

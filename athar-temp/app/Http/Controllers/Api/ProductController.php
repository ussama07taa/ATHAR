<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * GET /api/products
     * Supports ?category=slug &brand= &size= (contenance) filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['variants', 'category', 'relatedProducts.variants', 'relatedProducts.category'])
            ->where('is_active', true);

        $this->applyCategoryFilter($query, $request->category);

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->filled('size')) {
            $query->whereHas('variants', fn ($q) => $q->where('size', $request->size));
        }

        $products = $query->orderBy('name')->get();

        return response()->json($products);
    }

    /**
     * GET /api/products/filters
     * Returns available brands and contenances for catalogue sidebar.
     */
    public function filters(Request $request): JsonResponse
    {
        $query = Product::query()->where('is_active', true);
        $this->applyCategoryFilter($query, $request->category);

        $productIds = $query->pluck('id');

        $brandsInCategory = Product::whereIn('id', $productIds)
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->distinct()
            ->pluck('brand');

        $brands = Brand::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->pluck('name')
            ->merge($brandsInCategory)
            ->unique()
            ->values();

        $sizes = ProductVariant::whereIn('product_id', $productIds)
            ->distinct()
            ->orderBy('size')
            ->pluck('size')
            ->values();

        return response()->json([
            'brands' => $brands,
            'sizes'  => $sizes,
        ]);
    }

    private function applyCategoryFilter($query, ?string $categorySlug): void
    {
        if (! $categorySlug) {
            return;
        }

        $categoryIds = Category::resolveFilterIds($categorySlug);

        if (! $categoryIds) {
            $query->whereRaw('1 = 0');

            return;
        }

        // Products are assigned to leaf types (Eau de parfum, etc.)
        $assignableIds = Category::query()
            ->whereIn('id', $categoryIds)
            ->where('is_visible', true)
            ->whereDoesntHave('children', fn ($q) => $q->where('is_visible', true))
            ->pluck('id')
            ->all();

        $query->whereIn('category_id', $assignableIds ?: $categoryIds);
    }
}

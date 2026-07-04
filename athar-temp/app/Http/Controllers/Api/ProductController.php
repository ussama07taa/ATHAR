<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    /**
     * GET /api/products
     * Supports ?category=slug &brand= &size= (contenance) filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'products_index_' . md5(json_encode($request->all()));

        $products = Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Product::with([
                'variants', 
                'category', 
                'relatedProducts.variants', 
                'relatedProducts.category',
                'bundleProducts.variants',
                'bundleProducts.category'
            ])
                ->where('is_active', true);

            $this->applyCategoryFilter($query, $request->category);

            if ($request->filled('brand')) {
                $query->where('brand', $request->brand);
            }

            if ($request->filled('size')) {
                $query->whereHas('variants', fn ($q) => $q->where('size', $request->size));
            }

            if ($request->boolean('is_niche')) {
                $query->where('is_niche', true);
            }

            if ($request->boolean('is_pack')) {
                $query->where('is_pack', true);
            }

            if ($request->boolean('is_arabic')) {
                $query->where('is_arabic', true);
            }

            if ($request->boolean('is_decant')) {
                $query->where('is_decant', true);
            }

            if ($request->filled('gender') && $request->gender !== 'all') {
                $query->where('gender', $request->gender);
            }

            return $query->orderBy('name')->get();
        });

        return response()->json($products);
    }

    /**
     * GET /api/products/filters
     * Returns available brands and contenances for catalogue sidebar.
     */
    public function filters(Request $request): JsonResponse
    {
        $cacheKey = 'products_filters_' . md5(json_encode($request->all()));

        $data = Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Product::query()->where('is_active', true);
            $this->applyCategoryFilter($query, $request->category);

            if ($request->boolean('is_niche')) {
                $query->where('is_niche', true);
            }

            if ($request->boolean('is_pack')) {
                $query->where('is_pack', true);
            }

            if ($request->boolean('is_arabic')) {
                $query->where('is_arabic', true);
            }

            if ($request->boolean('is_decant')) {
                $query->where('is_decant', true);
            }

            $productIds = $query->pluck('id');

            // Get distinct brands from the selected products
            $brandsFromProducts = Product::whereIn('id', $productIds)
                ->whereNotNull('brand')
                ->pluck('brand')
                ->unique()
                ->filter();

            $brands = $brandsFromProducts->values();

            $sizes = ProductVariant::whereIn('product_id', $productIds)
                ->distinct()
                ->orderBy('size')
                ->pluck('size')
                ->values();

            return [
                'brands' => $brands,
                'sizes'  => $sizes,
            ];
        });

        return response()->json($data);
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

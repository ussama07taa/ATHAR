<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CollectionController extends Controller
{
    /**
     * GET /api/collections
     * Featured collection cards for homepage (Collections only, not Parfums).
     */
    public function index(): JsonResponse
    {
        $collections = Cache::remember('collections_index', 300, function () {
            return Category::visible()
                ->featured()
                ->get()
                ->map(function ($category) {
                    $data = $this->formatCategory($category);
                    $filterIds = Category::resolveFilterIds($category->slug) ?? [$category->id];
                    $data['products_count'] = Product::whereIn('category_id', $filterIds)
                        ->where('is_active', true)
                        ->count();

                    return $data;
                });
        });

        return response()->json($collections);
    }

    /**
     * GET /api/collections/menu
     * Parfums navigation tree only.
     */
    public function menu(): JsonResponse
    {
        $tree = Cache::remember('collections_menu', 300, function () {
            return Category::visible()
                ->topLevel()
                ->where('slug', 'parfums')
                ->with(['children' => function ($query) {
                    $query->visible()->with(['children' => function ($q) {
                        $q->visible()->withCount('products');
                    }]);
                }])
                ->get()
                ->map(fn ($category) => $this->formatMenuNode($category));
        });

        return response()->json($tree);
    }

    /**
     * GET /api/collections/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $categoryData = Cache::remember('collections_show_' . $slug, 300, function () use ($slug) {
            $category = Category::where('slug', $slug)
                ->where('is_visible', true)
                ->with(['parent.parent', 'children' => fn ($q) => $q->visible()->orderBy('sort_order')])
                ->firstOrFail();

            return [
                'id'          => $category->id,
                'name'        => $category->name,
                'slug'        => $category->slug,
                'description' => $category->description,
                'root'        => $category->getRootSlug(),
                'ancestors'   => array_map(fn ($a) => [
                    'name' => $a->name,
                    'slug' => $a->slug,
                ], $category->getAncestors()),
                'children'    => $category->children->map(fn ($child) => [
                    'id'   => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                ]),
            ];
        });

        return response()->json($categoryData);
    }

    private function formatCategory(Category $category): array
    {
        return [
            'id'             => $category->id,
            'name'           => $category->name,
            'slug'           => $category->slug,
            'description'    => $category->description,
            'image_url'      => $category->image
                ? asset('storage/' . $category->image)
                : null,
            'products_count' => $category->products_count ?? 0,
            'sort_order'     => $category->sort_order,
        ];
    }

    private function formatMenuNode(Category $category): array
    {
        return [
            'id'       => $category->id,
            'name'     => $category->name,
            'slug'     => $category->slug,
            'children' => $category->children->map(function ($child) {
                $node = [
                    'id'   => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                ];

                if ($child->children->isNotEmpty()) {
                    $node['children'] = $child->children->map(fn ($sub) => [
                        'id'             => $sub->id,
                        'name'           => $sub->name,
                        'slug'           => $sub->slug,
                        'products_count' => $sub->products_count ?? 0,
                    ]);
                }

                return $node;
            }),
        ];
    }
}

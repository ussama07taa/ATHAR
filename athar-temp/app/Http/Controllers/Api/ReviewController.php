<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * GET /api/reviews/featured
     */
    public function featured(): JsonResponse
    {
        $reviews = Review::query()
            ->featured()
            ->with('product:id,name,slug')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Review $r) => [
                'id'            => $r->id,
                'customer_name' => $r->customer_name,
                'customer_city' => $r->customer_city,
                'rating'        => $r->rating,
                'comment'       => $r->comment,
                'product'       => $r->product?->name,
            ]);

        $stats = Review::approved()
            ->selectRaw('COUNT(*) as count, AVG(rating) as average')
            ->first();

        return response()->json([
            'reviews' => $reviews,
            'stats'   => [
                'count'   => (int) ($stats->count ?? 0),
                'average' => round((float) ($stats->average ?? 0), 1),
            ],
        ]);
    }

    /**
     * POST /api/reviews
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id'     => 'nullable|integer|exists:products,id',
            'customer_name'  => 'required|string|max:100',
            'customer_city'  => 'nullable|string|max:100',
            'rating'         => 'required|integer|min:1|max:5',
            'comment'        => 'required|string|min:10|max:1000',
        ]);

        Review::create([
            ...$validated,
            'is_approved' => false,
            'is_featured' => false,
        ]);

        return response()->json([
            'message' => 'Merci ! Votre avis sera publié après validation.',
        ], 201);
    }
}

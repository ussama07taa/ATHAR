<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class SiteConfigController extends Controller
{
    /**
     * GET /api/site/config
     */
    public function show(): JsonResponse
    {
        return response()->json([
            'contact' => config('athar.contact'),
            'shipping' => config('athar.shipping'),
        ]);
    }
}

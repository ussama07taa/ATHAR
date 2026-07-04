<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();
            
        // Map image_url to include the full storage path if not already an absolute URL
        $banners->transform(function ($banner) {
            if ($banner->image_url && !str_starts_with($banner->image_url, 'http')) {
                $banner->image_url = asset('storage/' . $banner->image_url);
            }
            return $banner;
        });

        return response()->json($banners);
    }
}

<?php

use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromoCodeController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ShippingController;
use App\Http\Controllers\Api\SiteConfigController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Public storefront routes ───────────────────────────────────────────
Route::get('/site/config',          [SiteConfigController::class, 'show']);
Route::get('/banners',              [\App\Http\Controllers\Api\BannerController::class, 'index']);
Route::get('/collections',          [CollectionController::class, 'index']);
Route::get('/collections/menu',     [CollectionController::class, 'menu']);
Route::get('/collections/{slug}',   [CollectionController::class, 'show']);
Route::get('/products',             [ProductController::class, 'index']);
Route::get('/products/filters',     [ProductController::class, 'filters']);
Route::get('/shipping/config',      [ShippingController::class, 'config']);
Route::post('/shipping/calculate',  [ShippingController::class, 'calculate']);
Route::post('/promo/validate',      [PromoCodeController::class, 'validateCode'])->middleware('throttle:promo');
Route::post('/orders',              [CheckoutController::class, 'store'])->middleware('throttle:checkout');
Route::post('/orders/abandoned',    [CheckoutController::class, 'abandoned']);
Route::get('/orders/track',         [CheckoutController::class, 'track']);
Route::post('/newsletter/subscribe',[NewsletterController::class, 'subscribe']);
Route::get('/reviews/featured',     [ReviewController::class, 'featured']);
Route::post('/reviews',             [ReviewController::class, 'store']);

// ── Authenticated routes ───────────────────────────────────────────────
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

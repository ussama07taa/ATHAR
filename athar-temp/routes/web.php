<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/orders/print-bulk', \App\Http\Controllers\OrderBulkPrintController::class)
    ->name('orders.print-bulk')
    ->middleware(['web', 'auth']);

Route::get('/admin/orders/{order}/delete-direct', \App\Http\Controllers\OrderDeleteController::class)
    ->name('orders.delete-direct')
    ->middleware(['web', 'auth']);

Route::get('/admin/orders/{order}/print', \App\Http\Controllers\OrderPrintController::class)
    ->name('orders.print')
    ->middleware(['web', 'auth']);

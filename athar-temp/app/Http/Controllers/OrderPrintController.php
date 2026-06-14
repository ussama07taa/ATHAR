<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderPrintController extends Controller
{
    public function __invoke(Order $order)
    {
        // Eager load items and variants for label details
        $order->load(['items.variant.product']);
        
        return view('filament.print-label', compact('order'));
    }
}

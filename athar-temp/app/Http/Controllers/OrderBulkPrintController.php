<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderBulkPrintController extends Controller
{
    public function __invoke(Request $request)
    {
        $ids = explode(',', $request->get('ids', ''));
        if (empty($ids) || $ids[0] === '') {
            return redirect()->back()->with('error', 'Aucune commande sélectionnée.');
        }

        // Eager load items and variants for label details
        $orders = Order::with(['items.variant.product'])->whereIn('id', $ids)->get();
        
        return view('filament.print-labels', compact('orders'));
    }
}

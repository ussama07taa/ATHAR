<?php

namespace App\Http\Controllers;

use App\Filament\Resources\OrderResource;
use App\Models\Order;

class OrderDeleteController extends Controller
{
    public function __invoke(Order $order)
    {
        $order->delete();

        return redirect(OrderResource::getUrl('index'))
            ->with('success', 'Commande supprimée.');
    }
}

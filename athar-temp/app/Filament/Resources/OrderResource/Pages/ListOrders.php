<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use App\Models\Order;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('export')
                ->label('Exporter CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(fn (): StreamedResponse => response()->streamDownload(function () {
                    $handle = fopen('php://output', 'w');
                    fputcsv($handle, [
                        'numero', 'client', 'telephone', 'ville', 'quartier', 'adresse',
                        'sous_total', 'reduction', 'livraison', 'total', 'promo', 'statut', 'date',
                    ]);

                    Order::query()
                        ->with('items')
                        ->orderByDesc('created_at')
                        ->cursor()
                        ->each(function (Order $order) use ($handle) {
                            fputcsv($handle, [
                                $order->order_number,
                                $order->customer_name,
                                $order->customer_phone,
                                $order->customer_city,
                                $order->customer_quartier,
                                $order->customer_address,
                                $order->subtotal_amount,
                                $order->discount_amount,
                                $order->shipping_amount,
                                $order->total_amount,
                                $order->promo_code,
                                $order->status,
                                $order->created_at?->format('Y-m-d H:i'),
                            ]);
                        });

                    fclose($handle);
                }, 'commandes-' . now()->format('Y-m-d') . '.csv')),
        ];
    }
}

<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class OrdersChartWidget extends ChartWidget
{
    protected static ?string $heading = 'Ventes des 7 derniers jours';
    protected static ?int $sort = 2; // Placing it after stats (sort 1)

    protected function getData(): array
    {
        $data = [];
        $labels = [];

        // Fetch orders grouped by date for the last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            
            // Only count non-cancelled sales
            $sum = Order::whereDate('created_at', $date)
                ->where('status', '!=', 'cancelled')
                ->sum('total_amount');
                
            $data[] = (float) $sum;
            $labels[] = Carbon::now()->subDays($i)->isoFormat('dddd D'); // e.g. "lundi 15"
        }

        return [
            'datasets' => [
                [
                    'label' => 'Chiffre d\'Affaires (MAD)',
                    'data' => $data,
                    'backgroundColor' => '#C8A25C', // Athar gold
                    'borderColor' => '#C8A25C',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}

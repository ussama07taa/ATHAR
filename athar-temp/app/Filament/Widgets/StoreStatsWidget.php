<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StoreStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $pendingOrders = Order::query()->where('status', 'pending')->count();

        $monthRevenue = Order::query()
            ->whereIn('status', ['confirmed', 'shipped', 'delivered'])
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_amount');

        $activeProducts = Product::query()->where('is_active', true)->count();

        $lowStock = Product::query()
            ->lowStock(5)
            ->where('is_active', true)
            ->count();

        $incomplete = Product::query()->incomplete()->count();

        return [
            Stat::make('Commandes en attente', $pendingOrders)
                ->description('À confirmer')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingOrders > 0 ? 'warning' : 'success')
                ->url(route('filament.admin.resources.orders.index')),

            Stat::make('CA ce mois', number_format((float) $monthRevenue, 0, ',', ' ') . ' MAD')
                ->description(now()->translatedFormat('F Y'))
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Produits actifs', $activeProducts)
                ->description('En ligne sur le site')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('info')
                ->url(route('filament.admin.resources.products.index')),

            Stat::make('Stock faible', $lowStock)
                ->description('≤ 5 unités')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color($lowStock > 0 ? 'danger' : 'success')
                ->url(route('filament.admin.resources.products.index')),

            Stat::make('Produits incomplets', $incomplete)
                ->description('Image, marque ou variant manquant')
                ->descriptionIcon('heroicon-m-pencil-square')
                ->color($incomplete > 0 ? 'warning' : 'success')
                ->url(route('filament.admin.resources.products.index')),
        ];
    }
}

<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\RecentOrdersWidget;
use App\Filament\Widgets\StoreStatsWidget;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getWidgets(): array
    {
        return [
            StoreStatsWidget::class,
            RecentOrdersWidget::class,
        ];
    }
}

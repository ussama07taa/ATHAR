<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\OrderResource;
use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentOrdersWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Dernières commandes';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()->latest()->limit(8),
            )
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->label('N°')
                    ->fontFamily('mono')
                    ->searchable(),

                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Client'),

                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Total')
                    ->money('MAD'),

                Tables\Columns\TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending'   => 'gray',
                        'confirmed' => 'info',
                        'shipped'   => 'warning',
                        'delivered' => 'success',
                        'cancelled' => 'danger',
                        default     => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending'   => 'En attente',
                        'confirmed' => 'Confirmé',
                        'shipped'   => 'Expédié',
                        'delivered' => 'Livré',
                        'cancelled' => 'Annulé',
                        default     => $state,
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->since(),
            ])
            ->actions([
                Tables\Actions\Action::make('edit')
                    ->label('Voir')
                    ->icon('heroicon-m-eye')
                    ->url(fn (Order $record): string => OrderResource::getUrl('edit', ['record' => $record])),
            ])
            ->paginated(false);
    }
}

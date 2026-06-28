<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AbandonedCartResource\Pages\ListAbandonedCarts;
use App\Models\AbandonedCart;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AbandonedCartResource extends Resource
{
    protected static ?string $model = AbandonedCart::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationLabel = 'Paniers Abandonnés';
    protected static ?string $navigationGroup = 'Marketing';
    protected static ?string $modelLabel = 'Panier Abandonné';
    protected static ?string $pluralModelLabel = 'Paniers Abandonnés';
    protected static ?int $navigationSort = 1;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('customer_phone')
                    ->label('Téléphone')
                    ->searchable()
                    ->copyable()
                    ->fontFamily('mono'),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Nom (Optionnel)')
                    ->searchable(),
                Tables\Columns\TextColumn::make('payload')
                    ->label('Articles au panier')
                    ->formatStateUsing(function ($state) {
                        if (!is_array($state)) return 'Inconnu';
                        $count = collect($state)->sum('quantity');
                        return $count . ' article(s)';
                    }),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Dernière activité')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->badge(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->actions([
                Tables\Actions\Action::make('whatsapp')
                    ->label('Relancer (WhatsApp)')
                    ->icon('heroicon-o-chat-bubble-left-ellipsis')
                    ->color('success')
                    ->url(fn (AbandonedCart $record): string => "https://wa.me/212" . substr(preg_replace('/\D/', '', $record->customer_phone), -9) . "?text=Bonjour%20" . urlencode($record->customer_name ?? '') . ",%20nous%20avons%20noté%20que%20vous%20n'avez%20pas%20pu%20finaliser%20votre%20commande%20Athar.%20Avez-vous%20besoin%20d'aide%20?")
                    ->openUrlInNewTab(),
                Tables\Actions\DeleteAction::make()
                    ->label('Supprimer'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\AbandonedCartResource\Pages\ListAbandonedCarts::route('/'),
        ];
    }
}

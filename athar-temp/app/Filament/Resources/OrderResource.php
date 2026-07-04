<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'Commandes';
    protected static ?string $navigationGroup = 'Boutique';
    protected static ?int $navigationSort = 5;

    public static function canViewAny(): bool
    {
        return auth()->check();
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Détails de la Commande')
                            ->schema([
                                Forms\Components\TextInput::make('order_number')
                                    ->label('Numéro de Commande')
                                    ->disabled()
                                    ->dehydrated()
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\Select::make('status')
                                    ->label('Statut Actuel')
                                    ->options([
                                        'pending' => 'En attente',
                                        'confirmed' => 'Confirmé',
                                        'shipped' => 'Expédié',
                                        'delivered' => 'Livré',
                                        'cancelled' => 'Annulé',
                                    ])
                                    ->required()
                                    ->native(false),
                                Forms\Components\TextInput::make('total_amount')
                                    ->label('Montant Total')
                                    ->numeric()
                                    ->prefix('MAD')
                                    ->disabled()
                                    ->dehydrated(),
                                Forms\Components\TextInput::make('subtotal_amount')
                                    ->label('Sous-total')
                                    ->numeric()
                                    ->prefix('MAD')
                                    ->disabled()
                                    ->dehydrated(),
                                Forms\Components\TextInput::make('discount_amount')
                                    ->label('Réduction')
                                    ->numeric()
                                    ->prefix('MAD')
                                    ->disabled()
                                    ->dehydrated(),
                                Forms\Components\TextInput::make('shipping_amount')
                                    ->label('Livraison')
                                    ->numeric()
                                    ->prefix('MAD')
                                    ->disabled()
                                    ->dehydrated(),
                                Forms\Components\TextInput::make('promo_code')
                                    ->label('Code promo')
                                    ->disabled()
                                    ->dehydrated(),
                            ])->columns(2),

                        Forms\Components\Section::make('Articles Commandés')
                            ->schema([
                                Forms\Components\Repeater::make('items')
                                    ->relationship()
                                    ->schema([
                                        Forms\Components\Select::make('product_variant_id')
                                            ->label('Produit/Taille')
                                            ->relationship('variant', 'id')
                                            ->getOptionLabelFromRecordUsing(fn ($record) => ($record->product ? $record->product->name : 'Inconnu') . ' - ' . $record->size)
                                            ->disabled()
                                            ->dehydrated()
                                            ->columnSpan(2),
                                        Forms\Components\TextInput::make('quantity')
                                            ->label('Qté')
                                            ->numeric()
                                            ->disabled()
                                            ->dehydrated(),
                                        Forms\Components\TextInput::make('unit_price')
                                            ->label('Prix Unitaire')
                                            ->numeric()
                                            ->prefix('MAD')
                                            ->disabled()
                                            ->dehydrated(),
                                    ])->columns(4)
                                    ->addable(false)
                                    ->deletable(false)
                                    ->reorderable(false),
                            ]),
                    ])->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Client & Livraison')
                            ->schema([
                                Forms\Components\TextInput::make('customer_name')
                                    ->label('Nom du Client')
                                    ->required(),
                                Forms\Components\TextInput::make('customer_phone')
                                    ->label('Téléphone')
                                    ->tel()
                                    ->required(),
                                Forms\Components\TextInput::make('customer_city')
                                    ->label('Ville')
                                    ->required(),
                                Forms\Components\TextInput::make('customer_quartier')
                                    ->label('Quartier')
                                    ->required(),
                                Forms\Components\TextInput::make('customer_address')
                                    ->label('Adresse')
                                    ->required()
                                    ->columnSpanFull(),
                            ]),
                        
                        Forms\Components\Section::make('Chronologie')
                            ->schema([
                                Forms\Components\Placeholder::make('created_at')
                                    ->label('Reçue le')
                                    ->content(fn ($record): ?string => $record?->created_at?->diffForHumans()),
                                Forms\Components\Placeholder::make('updated_at')
                                    ->label('Dernière mise à jour')
                                    ->content(fn ($record): ?string => $record?->updated_at?->diffForHumans()),
                            ]),
                    ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->label('N° Commande')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->fontFamily('mono'),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Client')
                    ->searchable(),
                Tables\Columns\TextColumn::make('customer_phone')
                    ->label('Téléphone')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Total')
                    ->money('MAD')
                    ->sortable()
                    ->summarize(Tables\Columns\Summarizers\Sum::make()->label('Total Revenu')),
                Tables\Columns\TextColumn::make('promo_code')
                    ->label('Promo')
                    ->badge()
                    ->color('warning')
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('discount_amount')
                    ->label('Réduction')
                    ->money('MAD')
                    ->toggleable(),
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
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d/m H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'En attente',
                        'confirmed' => 'Confirmé',
                        'shipped' => 'Expédié',
                        'delivered' => 'Livré',
                        'cancelled' => 'Annulé',
                    ]),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\Action::make('confirm')
                        ->label('Confirmer')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->modalHeading('Confirmer la commande')
                        ->modalDescription('Êtes-vous sûr de vouloir confirmer cette commande ?')
                        ->modalSubmitActionLabel('Oui, confirmer')
                        ->action(fn (Order $record) => $record->update(['status' => 'confirmed']))
                        ->visible(fn (Order $record) => $record->status === 'pending'),
                    
                    Tables\Actions\Action::make('ship')
                        ->label('Expédier')
                        ->icon('heroicon-o-truck')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->modalHeading('Expédier la commande')
                        ->modalDescription('Ceci marquera la commande comme expédiée. Voulez-vous continuer ?')
                        ->modalSubmitActionLabel('Oui, expédier')
                        ->action(fn (Order $record) => $record->update(['status' => 'shipped']))
                        ->visible(fn (Order $record) => $record->status === 'confirmed'),

                    Tables\Actions\Action::make('deliver')
                        ->label('Livré')
                        ->icon('heroicon-o-gift')
                        ->color('success')
                        ->requiresConfirmation()
                        ->modalHeading('Commande Livrée')
                        ->modalDescription('Le client a reçu le colis et réglé le paiement (COD) ?')
                        ->modalSubmitActionLabel('Oui, marquer Livré')
                        ->action(fn (Order $record) => $record->update(['status' => 'delivered']))
                        ->visible(fn (Order $record) => $record->status === 'shipped'),

                    Tables\Actions\Action::make('cancel')
                        ->label('Annuler')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->modalHeading('Annuler la commande')
                        ->modalDescription('Le stock sera remis en inventaire. Êtes-vous sûr ?')
                        ->modalSubmitActionLabel('Oui, annuler')
                        ->action(fn (Order $record) => $record->update(['status' => 'cancelled']))
                        ->visible(fn (Order $record) => ! in_array($record->status, ['cancelled', 'delivered'], true)),

                    Tables\Actions\Action::make('printLabel')
                        ->label('Imprimer Étiquette')
                        ->icon('heroicon-o-printer')
                        ->color('info')
                        ->url(fn (Order $record): string => route('orders.print', $record))
                        ->openUrlInNewTab(),
                    
                    Tables\Actions\EditAction::make(),
                ])
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('print_labels')
                        ->label('Imprimer Étiquettes')
                        ->icon('heroicon-o-printer')
                        ->color('info')
                        ->action(fn (\Illuminate\Database\Eloquent\Collection $records) => 
                            redirect()->route('orders.print-bulk', ['ids' => $records->pluck('id')->implode(',')])
                        ),
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            // ->with(['items.variant']) // Temporarily suspended to check Livewire serialization bug
            ->latest();
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}

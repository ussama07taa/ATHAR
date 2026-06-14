<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PromoCodeResource\Pages;
use App\Models\PromoCode;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PromoCodeResource extends Resource
{
    protected static ?string $model = PromoCode::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    protected static ?string $navigationLabel = 'Codes promo';
    protected static ?string $modelLabel = 'Code promo';
    protected static ?string $pluralModelLabel = 'Codes promo';
    protected static ?string $navigationGroup = 'Marketing';
    protected static ?int $navigationSort = 1;

    public static function canViewAny(): bool
    {
        return auth()->user()?->canManageCatalog() ?? false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Code promo')
                ->schema([
                    Forms\Components\TextInput::make('code')
                        ->label('Code')
                        ->required()
                        ->maxLength(50)
                        ->unique(ignoreRecord: true)
                        ->dehydrateStateUsing(fn (?string $state) => strtoupper(trim($state ?? '')))
                        ->placeholder('ATHAR10'),

                    Forms\Components\Select::make('type')
                        ->label('Type')
                        ->options([
                            PromoCode::TYPE_PERCENTAGE => 'Pourcentage (%)',
                            PromoCode::TYPE_FIXED      => 'Montant fixe (MAD)',
                        ])
                        ->required()
                        ->native(false)
                        ->default(PromoCode::TYPE_PERCENTAGE),

                    Forms\Components\TextInput::make('value')
                        ->label('Valeur')
                        ->required()
                        ->numeric()
                        ->minValue(0.01),

                    Forms\Components\TextInput::make('min_order_amount')
                        ->label('Montant minimum (MAD)')
                        ->numeric()
                        ->minValue(0)
                        ->nullable(),

                    Forms\Components\TextInput::make('max_uses')
                        ->label('Utilisations max')
                        ->numeric()
                        ->minValue(1)
                        ->nullable()
                        ->helperText('Laissez vide pour illimité'),

                    Forms\Components\DateTimePicker::make('starts_at')
                        ->label('Début')
                        ->nullable(),

                    Forms\Components\DateTimePicker::make('expires_at')
                        ->label('Expiration')
                        ->nullable(),

                    Forms\Components\Toggle::make('is_active')
                        ->label('Actif')
                        ->default(true),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Code')
                    ->searchable()
                    ->weight('bold')
                    ->copyable(),

                Tables\Columns\TextColumn::make('label')
                    ->label('Réduction'),

                Tables\Columns\TextColumn::make('used_count')
                    ->label('Utilisations')
                    ->badge(),

                Tables\Columns\TextColumn::make('max_uses')
                    ->label('Max')
                    ->placeholder('∞'),

                Tables\Columns\TextColumn::make('expires_at')
                    ->label('Expire')
                    ->dateTime('d/m/Y')
                    ->placeholder('—'),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Actif'),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListPromoCodes::route('/'),
            'create' => Pages\CreatePromoCode::route('/create'),
            'edit'   => Pages\EditPromoCode::route('/{record}/edit'),
        ];
    }
}

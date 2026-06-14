<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationLabel = 'Collections Accueil';
    protected static ?string $modelLabel = 'Collection Accueil';
    protected static ?string $pluralModelLabel = 'Collections Accueil';
    protected static ?string $navigationGroup = 'Boutique';
    protected static ?int $navigationSort = 4;

    public static function canViewAny(): bool
    {
        return auth()->user()?->canManageCatalog() ?? false;
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->homeCollections();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informations principales')
                    ->schema([
                        Forms\Components\Select::make('parent_id')
                            ->label('Catégorie parente')
                            ->relationship('parent', 'name')
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->disabled(fn (?Category $record) => $record?->isProtected() ?? false)
                            ->helperText('Laissez vide pour une catégorie principale (ex: Parfums)'),

                        Forms\Components\TextInput::make('name')
                            ->label('Nom de la collection')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', Str::slug($state))),

                        Forms\Components\TextInput::make('slug')
                            ->label('Slug (URL)')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->disabled(fn (?Category $record) => $record?->isProtected() ?? false)
                            ->helperText('Généré automatiquement depuis le nom'),

                        Forms\Components\Textarea::make('description')
                            ->label('Description (optionnelle)')
                            ->rows(3)
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Image & Affichage')
                    ->schema([
                        Forms\Components\FileUpload::make('image')
                            ->label('Image de couverture')
                            ->image()
                            ->directory('collections')
                            ->disk('public')
                            ->imageEditor()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(2048)
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('sort_order')
                            ->label('Ordre d\'affichage')
                            ->numeric()
                            ->default(0)
                            ->helperText('Plus le chiffre est petit, plus la collection apparaît en premier'),

                        Forms\Components\Toggle::make('is_visible')
                            ->label('Visible sur le site')
                            ->default(true)
                            ->onColor('success')
                            ->offColor('danger'),

                        Forms\Components\Toggle::make('is_featured')
                            ->label('Carte sur l\'accueil')
                            ->default(false)
                            ->helperText('Afficher dans la grille Collections de la page d\'accueil (pas le menu Parfums)'),

                        Forms\Components\TextInput::make('featured_sort_order')
                            ->label('Ordre accueil')
                            ->numeric()
                            ->default(0)
                            ->visible(fn (Forms\Get $get) => $get('is_featured')),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->disk('public')
                    ->width(60)
                    ->height(60)
                    ->defaultImageUrl(asset('images/no-image.png')),

                Tables\Columns\TextColumn::make('parent.name')
                    ->label('Parent')
                    ->searchable()
                    ->sortable()
                    ->color('gray')
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('products_count')
                    ->label('Produits')
                    ->counts('products')
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Ordre')
                    ->sortable()
                    ->alignCenter(),

                Tables\Columns\ToggleColumn::make('is_visible')
                    ->label('Visible')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Créée le')
                    ->date('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order', 'asc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_visible')
                    ->label('Visibilité')
                    ->trueLabel('Visibles')
                    ->falseLabel('Cachées')
                    ->native(false),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Accueil')
                    ->trueLabel('En vedette')
                    ->falseLabel('Non vedette'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->visible(fn (Category $record) => ! $record->isProtected())
                    ->before(function (Category $record) {
                        if ($record->products()->exists()) {
                            throw new \RuntimeException(
                                'Impossible de supprimer une catégorie qui contient des produits.',
                            );
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->before(function ($records) {
                            foreach ($records as $record) {
                                if ($record->isProtected()) {
                                    throw new \RuntimeException(
                                        "La catégorie « {$record->name} » est protégée.",
                                    );
                                }
                            }
                        }),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit'   => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}

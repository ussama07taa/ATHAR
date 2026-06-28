<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ParfumsCategoryResource\Pages;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ParfumsCategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $slug = 'parfums-categories';

    protected static ?string $navigationIcon = 'heroicon-o-sparkles';
    protected static ?string $navigationLabel = 'Parfums';
    protected static ?string $modelLabel = 'Catégorie Parfums';
    protected static ?string $pluralModelLabel = 'Arbre Parfums';
    protected static ?string $navigationGroup = 'Boutique';
    protected static ?int $navigationSort = 2;

    public static function canViewAny(): bool
    {
        return auth()->user()?->canManageCatalog() ?? false;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->inParfumsTree()->with('parent');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([

            // ── Section 1: Informations Générales ───────────────
            Forms\Components\Section::make('Informations Générales')
                ->description('Structure du menu Parfums. Les catégories principales sont protégées.')
                ->icon('heroicon-o-information-circle')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Nom')
                        ->required()
                        ->disabled(fn (?Category $record) => $record?->isProtected() ?? false)
                        ->maxLength(255),

                    Forms\Components\TextInput::make('slug')
                        ->label('Slug')
                        ->disabled()
                        ->dehydrated(),

                    Forms\Components\Placeholder::make('parent_label')
                        ->label('Parent')
                        ->content(fn (?Category $record): string => $record?->parent?->name ?? '—'),

                    Forms\Components\TextInput::make('sort_order')
                        ->label('Ordre d\'affichage')
                        ->numeric()
                        ->default(0),

                    Forms\Components\Toggle::make('is_visible')
                        ->label('Visible sur le site')
                        ->default(true),
                ])
                ->columns(2),

            // ── Section 2: Apparence Visuelle ───────────────────
            Forms\Components\Section::make('Apparence Visuelle')
                ->description('Personnalisez l\'identité visuelle de cette catégorie.')
                ->icon('heroicon-o-paint-brush')
                ->schema([
                    Forms\Components\FileUpload::make('image')
                        ->label('Image / Bannière')
                        ->image()
                        ->directory('categories')
                        ->maxSize(2048)
                        ->imageResizeMode('cover')
                        ->imageCropAspectRatio('16:9')
                        ->imageResizeTargetWidth('1200')
                        ->imageResizeTargetHeight('675')
                        ->columnSpanFull(),

                    Forms\Components\Textarea::make('description')
                        ->label('Description')
                        ->rows(3)
                        ->maxLength(500)
                        ->placeholder('Description courte visible sur la page catégorie...')
                        ->columnSpanFull(),

                    Forms\Components\ColorPicker::make('color')
                        ->label('Couleur de la catégorie')
                        ->hexColor(),

                    Forms\Components\Toggle::make('is_featured')
                        ->label('Mise en avant (Homepage)')
                        ->helperText('Afficher cette catégorie dans la section vedette de la page d\'accueil.'),

                    Forms\Components\TextInput::make('featured_sort_order')
                        ->label('Ordre vedette')
                        ->numeric()
                        ->default(0)
                        ->visible(fn (Forms\Get $get) => $get('is_featured')),
                ])
                ->columns(2)
                ->collapsible(),

            // ── Section 3: SEO ──────────────────────────────────
            Forms\Components\Section::make('SEO & Référencement')
                ->description('Optimisez le référencement de la page catégorie sur Google.')
                ->icon('heroicon-o-globe-alt')
                ->schema([
                    Forms\Components\TextInput::make('meta_title')
                        ->label('Titre SEO')
                        ->placeholder('Parfums Femmes - Athar Maison de Parfums')
                        ->maxLength(70)
                        ->helperText('Max 70 caractères. Laissez vide pour utiliser le nom automatiquement.'),

                    Forms\Components\Textarea::make('meta_description')
                        ->label('Description SEO')
                        ->placeholder('Découvrez notre collection de parfums pour femmes...')
                        ->rows(2)
                        ->maxLength(160)
                        ->helperText('Max 160 caractères pour un affichage optimal sur Google.'),
                ])
                ->columns(1)
                ->collapsible()
                ->collapsed(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('parent.name')
                    ->label('Parent')
                    ->placeholder('—')
                    ->color('gray'),

                Tables\Columns\ColorColumn::make('color')
                    ->label('')
                    ->toggleable(),

                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->circular()
                    ->size(36)
                    ->toggleable()
                    ->defaultImageUrl(fn () => 'https://ui-avatars.com/api/?background=C8A25C&color=fff&name=?&size=36'),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->icon(fn (Category $record) => $record->isProtected() ? 'heroicon-m-lock-closed' : null),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->color('gray')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('products_count')
                    ->label('Produits')
                    ->counts('products')
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Ordre')
                    ->sortable()
                    ->alignCenter(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Vedette')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-minus')
                    ->trueColor('warning')
                    ->alignCenter()
                    ->toggleable(),

                Tables\Columns\ToggleColumn::make('is_visible')
                    ->label('Visible')
                    ->alignCenter(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_visible')
                    ->label('Visibilité'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Mise en avant'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListParfumsCategories::route('/'),
            'edit'  => Pages\EditParfumsCategory::route('/{record}/edit'),
        ];
    }
}

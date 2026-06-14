<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-beaker';
    protected static ?string $navigationLabel = 'Produits';
    protected static ?string $modelLabel = 'Produit';
    protected static ?string $pluralModelLabel = 'Produits';
    protected static ?string $navigationGroup = 'Boutique';
    protected static ?int $navigationSort = 1;

    public static function canViewAny(): bool
    {
        return auth()->user()?->canManageCatalog() ?? false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Catégorie')
                    ->description('1) Femmes ou Hommes — 2) Type de parfum')
                    ->schema([
                        Forms\Components\Select::make('gender_id')
                            ->label('Femmes / Hommes')
                            ->options(fn () => static::getGenderOptions())
                            ->live()
                            ->required()
                            ->dehydrated(false)
                            ->native(false)
                            ->placeholder('Femmes ou Hommes...')
                            ->afterStateUpdated(function (Set $set) {
                                $set('category_id', null);
                            }),

                        Forms\Components\Select::make('category_id')
                            ->label('Type de parfum')
                            ->options(fn (Get $get) => static::getSubcategoryOptions($get('gender_id')))
                            ->required()
                            ->native(false)
                            ->searchable()
                            ->placeholder('Eau de parfum, Eau de toilette...')
                            ->hidden(fn (Get $get) => blank($get('gender_id')))
                            ->key(fn (Get $get) => 'category-' . ($get('gender_id') ?? 'none'))
                            ->helperText(fn (Get $get) => blank($get('gender_id'))
                                ? 'Choisissez d\'abord Femmes ou Hommes'
                                : 'Cliquez sur + pour ajouter un nouveau type')
                            ->createOptionForm([
                                Forms\Components\TextInput::make('name')
                                    ->label('Nom du type')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Ex: Brume parfumée'),
                            ])
                            ->createOptionUsing(function (array $data, Get $get): int {
                                return static::createSubcategory((int) $get('gender_id'), $data['name']);
                            })
                            ->createOptionAction(fn (Forms\Components\Actions\Action $action) => $action
                                ->modalHeading('Ajouter un type de parfum')
                                ->modalSubmitActionLabel('Créer')
                                ->icon('heroicon-m-plus')),
                    ])
                    ->columns(2),

                Forms\Components\Select::make('brand')
                    ->label('Marque')
                    ->searchable()
                    ->required()
                    ->native(false)
                    ->options(fn () => static::getBrandOptions())
                    ->createOptionForm([
                        Forms\Components\TextInput::make('name')
                            ->label('Nom de la marque')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Ex: Dior, Tom Ford...'),
                    ])
                    ->createOptionUsing(function (array $data): string {
                        $brand = Brand::firstOrCreate(
                            ['slug' => Str::slug($data['name'])],
                            ['name' => $data['name'], 'is_active' => true],
                        );

                        return $brand->name;
                    })
                    ->createOptionAction(fn (Forms\Components\Actions\Action $action) => $action
                        ->modalHeading('Nouvelle marque')
                        ->modalSubmitActionLabel('Ajouter')
                        ->icon('heroicon-m-plus')),

                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                Forms\Components\Textarea::make('description')
                    ->required()
                    ->maxLength(65535)
                    ->columnSpanFull(),

                Forms\Components\Section::make('SEO')
                    ->description('Référencement Google et réseaux sociaux')
                    ->schema([
                        Forms\Components\TextInput::make('meta_title')
                            ->label('Titre SEO')
                            ->maxLength(70)
                            ->placeholder(fn (?Product $record) => $record?->name)
                            ->helperText('Max 70 caractères — laissez vide pour utiliser le nom du produit'),

                        Forms\Components\Textarea::make('meta_description')
                            ->label('Description SEO')
                            ->maxLength(160)
                            ->rows(3)
                            ->placeholder(fn (?Product $record) => $record?->description)
                            ->helperText('Max 160 caractères'),
                    ])
                    ->columns(1)
                    ->collapsible()
                    ->collapsed(),

                Forms\Components\Toggle::make('is_pack')
                    ->label('Est un pack')
                    ->default(false),
                Forms\Components\Toggle::make('is_active')
                    ->default(true)
                    ->required(),
                Forms\Components\FileUpload::make('image')
                    ->label('Image principale (WEBP)')
                    ->image()
                    ->acceptedFileTypes(['image/webp'])
                    ->directory('products')
                    ->nullable()
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('gallery')
                    ->label('Galerie d\'images (WEBP)')
                    ->multiple()
                    ->image()
                    ->reorderable()
                    ->acceptedFileTypes(['image/webp'])
                    ->directory('products/gallery')
                    ->columnSpanFull(),
                Forms\Components\Repeater::make('variants')
                    ->relationship()
                    ->schema([
                        Forms\Components\Select::make('size')
                            ->label('Contenance')
                            ->searchable()
                            ->required()
                            ->native(false)
                            ->options(fn () => static::getContenanceOptions())
                            ->createOptionForm([
                                Forms\Components\TextInput::make('size')
                                    ->label('Contenance')
                                    ->required()
                                    ->placeholder('Ex: 75ml'),
                            ])
                            ->createOptionUsing(fn (array $data): string => $data['size']),
                        Forms\Components\TextInput::make('price')
                            ->label('Prix Actuel (MAD)')
                            ->required()
                            ->numeric()
                            ->prefix('MAD'),
                        Forms\Components\TextInput::make('compare_at_price')
                            ->label('Prix Barré (Original) MAD')
                            ->numeric()
                            ->prefix('MAD')
                            ->placeholder('Ex: 1500 (laissez vide si pas de promo)'),
                        Forms\Components\TextInput::make('sku')
                            ->label('SKU (Généré Auto)')
                            ->default(fn () => 'ATH-' . strtoupper(Str::random(6)))
                            ->required()
                            ->unique('product_variants', 'sku', ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\TextInput::make('stock')
                            ->label('Stock Dispo')
                            ->required()
                            ->numeric()
                            ->default(0),
                    ])
                    ->columns(4)
                    ->columnSpanFull()
                    ->itemLabel(fn (array $state): ?string => $state['size'] ?? null),

                Forms\Components\Section::make('Marketing & Recommandations')
                    ->description('Curation manuelle des produits recommandés en bas de page.')
                    ->schema([
                        Forms\Components\Select::make('relatedProducts')
                            ->relationship('relatedProducts', 'name')
                            ->multiple()
                            ->searchable()
                            ->placeholder('Choisissez les parfums à recommander...')
                            ->preload()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('badge_label')
                            ->label('Texte du Badge Promo (ex: "FREE SHIPPING" ou "-20%")')
                            ->maxLength(255)
                            ->placeholder('Laissez vide pour cacher le badge'),
                        Forms\Components\ColorPicker::make('badge_color')
                            ->label('Couleur du Badge (Optionnel)')
                            ->default('#C8A25C'),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image'),
                Tables\Columns\TextColumn::make('category.full_path')
                    ->label('Catégorie')
                    ->badge()
                    ->color('warning')
                    ->searchable(),
                Tables\Columns\TextColumn::make('brand')
                    ->label('Marque')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_pack')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('variants_sum_stock')
                    ->label('Stock total')
                    ->badge()
                    ->color(fn ($state) => ($state ?? 0) <= 0 ? 'danger' : 'success'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('gender')
                    ->label('Femmes / Hommes')
                    ->options(fn () => Category::whereIn('slug', ['femmes', 'hommes'])->pluck('name', 'id'))
                    ->query(function ($query, array $data) {
                        if (empty($data['value'])) {
                            return $query;
                        }

                        $ids = Category::find($data['value'])?->getDescendantIds() ?? [];

                        return $query->whereIn('category_id', $ids);
                    }),

                Tables\Filters\Filter::make('low_stock')
                    ->label('Stock faible (≤ 5)')
                    ->query(fn (Builder $query) => $query->lowStock(5)),

                Tables\Filters\Filter::make('incomplete')
                    ->label('Incomplets')
                    ->query(fn (Builder $query) => $query->incomplete()),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Actif')
                    ->trueLabel('Actifs')
                    ->falseLabel('Inactifs'),
            ])
            ->actions([
                Tables\Actions\Action::make('preview')
                    ->label('Voir')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn (Product $record): string => $record->frontend_url)
                    ->openUrlInNewTab(),

                Tables\Actions\Action::make('duplicate')
                    ->label('Dupliquer')
                    ->icon('heroicon-o-document-duplicate')
                    ->action(function (Product $record) {
                        $copy = static::duplicateProduct($record);

                        return redirect(static::getUrl('edit', ['record' => $copy]));
                    }),

                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    protected static function createSubcategory(int $genderId, string $name): int
    {
        $gender = Category::findOrFail($genderId);

        $baseSlug = $gender->slug . '-' . Str::slug($name);
        $slug     = $baseSlug;
        $counter  = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $maxOrder = Category::where('parent_id', $genderId)->max('sort_order') ?? 0;

        $category = Category::create([
            'parent_id'  => $genderId,
            'name'       => $name,
            'slug'       => $slug,
            'is_visible' => true,
            'sort_order' => $maxOrder + 1,
        ]);

        return $category->id;
    }

    /** @return array<string, string> */
    protected static function getBrandOptions(): array
    {
        return Brand::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->pluck('name', 'name')
            ->all();
    }

    /** @return array<string, string> */
    protected static function getContenanceOptions(): array
    {
        $existing = \App\Models\ProductVariant::query()
            ->distinct()
            ->orderBy('size')
            ->pluck('size', 'size')
            ->all();

        $defaults = [
            '10ml'  => '10 ml',
            '20ml'  => '20 ml',
            '30ml'  => '30 ml',
            '50ml'  => '50 ml',
            '75ml'  => '75 ml',
            '100ml' => '100 ml',
            '150ml' => '150 ml',
            '200ml' => '200 ml',
        ];

        return array_merge($defaults, $existing);
    }

    /** @return array<string, string> */
    protected static function getGenderOptions(): array
    {
        return Category::query()
            ->whereIn('slug', ['femmes', 'hommes'])
            ->orderBy('sort_order')
            ->get()
            ->mapWithKeys(fn (Category $cat) => [(string) $cat->id => $cat->name])
            ->all();
    }

    /** @return array<string, string> */
    protected static function getSubcategoryOptions(mixed $genderId): array
    {
        if (blank($genderId)) {
            return [];
        }

        $gender = Category::find((int) $genderId);

        if (! $gender) {
            return [];
        }

        $legacySuffixes = ['10ml', 'pack-decante', 'parfum-complet', 'parfum-niche'];

        $query = Category::query()
            ->where('is_visible', true)
            ->where(function ($q) use ($gender, $legacySuffixes) {
                $q->where('parent_id', $gender->id)
                    ->orWhere(function ($q2) use ($gender, $legacySuffixes) {
                        $q2->where('slug', 'like', $gender->slug . '-%')
                            ->whereNotIn('slug', array_map(
                                fn ($suffix) => $gender->slug . '-' . $suffix,
                                $legacySuffixes,
                            ));
                    });
            })
            ->orderBy('sort_order')
            ->orderBy('name');

        return $query
            ->get()
            ->filter(fn (Category $cat) => $cat->isAssignable())
            ->mapWithKeys(fn (Category $cat) => [(string) $cat->id => $cat->name])
            ->all();
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->withSum('variants', 'stock');
    }

    public static function duplicateProduct(Product $product): Product
    {
        $copy = $product->replicate(['slug']);
        $copy->slug      = static::uniqueSlug($product->slug . '-copie');
        $copy->name      = $product->name . ' (copie)';
        $copy->is_active = false;
        $copy->save();

        $product->loadMissing(['variants', 'relatedProducts']);

        foreach ($product->variants as $variant) {
            $newVariant             = $variant->replicate();
            $newVariant->product_id = $copy->id;
            $newVariant->sku        = 'ATH-' . strtoupper(Str::random(6));
            $newVariant->save();
        }

        if ($product->relatedProducts->isNotEmpty()) {
            $copy->relatedProducts()->sync($product->relatedProducts->pluck('id'));
        }

        return $copy;
    }

    protected static function uniqueSlug(string $base): string
    {
        $slug    = Str::slug($base);
        $counter = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = Str::slug($base) . '-' . $counter++;
        }

        return $slug;
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit'   => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}

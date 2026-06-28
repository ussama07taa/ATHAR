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
                // 1. MASTER CLASSIFICATION
                Forms\Components\Section::make('Classification & Status')
                    ->description('Définissez le type de produit pour adapter le formulaire.')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\Radio::make('collection_type')
                                    ->label('Type de Collection')
                                    ->options([
                                        'standard' => 'Parfum Complet (Standard)',
                                        'niche' => 'Parfum Niche (Luxe)',
                                        'pack' => 'Pack / Coffret',
                                    ])
                                    ->default('standard')
                                    ->descriptions([
                                        'standard' => 'Produits classiques de la boutique.',
                                        'niche' => 'Senteurs exclusives (Thème Obsidian).',
                                        'pack' => 'Découverte ou Coffrets cadeaux.',
                                    ])
                                    ->required()
                                    ->live()
                                    ->afterStateHydrated(function (Set $set, $record) {
                                        if ($record) {
                                            if ($record->is_pack) $set('collection_type', 'pack');
                                            elseif ($record->is_niche) $set('collection_type', 'niche');
                                            else $set('collection_type', 'standard');
                                        }
                                    })
                                    ->afterStateUpdated(function (Set $set, $state) {
                                        $set('is_pack', $state === 'pack');
                                        $set('is_niche', $state === 'niche');
                                    })
                                    ->columnSpan(2),

                                Forms\Components\Grid::make(1)
                                    ->schema([
                                        Forms\Components\Toggle::make('is_active')
                                            ->label('Visible sur le site')
                                            ->default(true)
                                            ->inline(false),

                                        Forms\Components\Toggle::make('is_arabic')
                                            ->label('🕌 Parfum Arabic')
                                            ->helperText('Cocher pour afficher dans la section Parfums Arabic.')
                                            ->default(false)
                                            ->inline(false),
                                    ])
                                    ->columnSpan(1),
                            ]),

                        Forms\Components\Hidden::make('is_pack'),
                        Forms\Components\Hidden::make('is_niche'),
                    ]),

                // 2. PACK CONFIGURATION
                Forms\Components\Section::make('Configuration du Pack')
                    ->description('Définissez si le client choisit ses parfums ou si le pack est pré-défini.')
                    ->schema([
                        Forms\Components\Radio::make('is_custom_pack')
                            ->label('Type de Pack')
                            ->options([
                                true => 'Personnalisable (Le client choisit via le Box Builder)',
                                false => 'Fixe (Contenu pré-déterminé)',
                            ])
                            ->default(true)
                            ->live(),
                            
                        Forms\Components\TextInput::make('pack_slots')
                            ->label('Nombre de parfums à choisir')
                            ->helperText('Ex: Saisissez 10 pour un pack où le client doit choisir 10 parfums.')
                            ->numeric()
                            ->default(3)
                            ->minValue(2)
                            ->visible(fn (Get $get) => $get('is_custom_pack')),

                        Forms\Components\Select::make('bundleProducts')
                            ->label(fn (Get $get) => $get('is_custom_pack') ? 'Parfums disponibles au choix' : 'Produits inclus dans le pack')
                            ->helperText(fn (Get $get) => $get('is_custom_pack') 
                                ? 'Ces parfums apparaîtront dans le constructeur de coffret pour le client.'
                                : 'Ces produits seront listés comme le contenu fixe de ce coffret.'
                            )
                            ->relationship('bundleProducts', 'name')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->required(fn (Get $get) => $get('collection_type') === 'pack')
                            ->columnSpanFull(),
                    ])
                    ->visible(fn (Get $get) => $get('collection_type') === 'pack')
                    ->collapsible(),

                // 3. CATEGORIZATION
                Forms\Components\Section::make('Catégorisation')
                    ->description('Cible et Type de parfum.')
                    ->schema([
                        Forms\Components\Radio::make('gender')
                            ->label('Sexe (Persistant)')
                            ->options([
                                'homme' => 'Homme',
                                'femme' => 'Femme',
                                'unisex' => 'Unisex',
                            ])
                            ->required()
                            ->default('unisex')
                            ->columnSpanFull(),

                        Forms\Components\Select::make('gender_id')
                            ->label('Univers (Filtrage)')
                            ->options(fn () => static::getGenderOptions())
                            ->live()
                            ->required()
                            ->dehydrated(false)
                            ->native(false)
                            ->afterStateUpdated(function (Set $set, $state) {
                                $set('category_id', null);
                                if ($state) {
                                    $gender = Category::find($state);
                                    if ($gender) {
                                        $set('gender', $gender->slug === 'hommes' ? 'homme' : ($gender->slug === 'femmes' ? 'femme' : 'unisex'));
                                    }
                                }
                            }),

                        Forms\Components\Select::make('category_id')
                            ->label('Type de parfum')
                            ->options(fn (Get $get) => static::getSubcategoryOptions($get('gender_id')))
                            ->required(fn (Get $get) => $get('collection_type') !== 'pack' && !blank($get('gender_id')))
                            ->native(false)
                            ->searchable()
                            ->hidden(fn (Get $get) => $get('collection_type') === 'pack' || blank($get('gender_id')))
                    ])
                    ->columns(2),

                // 4. GENERAL INFO
                Forms\Components\Section::make('Informations Générales')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->label('Nom du produit')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                                
                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true),

                                Forms\Components\Select::make('brand')
                                    ->label('Marque')
                                    ->searchable()
                                    ->required()
                                    ->native(false)
                                    ->options(fn () => static::getBrandOptions())
                                    ->columnSpan(2)
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('name')->required(),
                                    ])
                                    ->createOptionUsing(fn (array $data) => Brand::firstOrCreate(['slug' => Str::slug($data['name'])], ['name' => $data['name'], 'is_active' => true])->name)
                                    ->createOptionAction(fn ($action) => $action->modalHeading('Nouvelle marque')->icon('heroicon-m-plus')),
                            ]),

                        Forms\Components\Textarea::make('description')
                            ->label('Description')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                // 5. MEDIA
                Forms\Components\Section::make('Images & Galerie')
                    ->schema([
                        Forms\Components\FileUpload::make('image')
                            ->label('Image principale')
                            ->image()
                            ->imageEditor()
                            ->imageResizeTargetWidth('1000')
                            ->imageResizeTargetHeight('1000')
                            ->disk('public')
                            ->acceptedFileTypes(['image/webp', 'image/jpeg', 'image/png'])
                            ->directory('products')
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('gallery')
                            ->label('Galerie')
                            ->multiple()
                            ->image()
                            ->imageEditor()
                            ->imageResizeTargetWidth('1000')
                            ->imageResizeTargetHeight('1000')
                            ->disk('public')
                            ->reorderable()
                            ->directory('products/gallery')
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),

                // 6. VARIANTS
                Forms\Components\Section::make('Contenance & Prix')
                    ->schema([
                        Forms\Components\Repeater::make('variants')
                            ->relationship()
                            ->schema([
                                Forms\Components\Select::make('size')
                                    ->label('Taille')
                                    ->options(fn () => static::getContenanceOptions())
                                    ->searchable()
                                    ->required(),
                                Forms\Components\TextInput::make('price')
                                    ->label('Prix (MAD)')
                                    ->numeric()
                                    ->required(),
                                Forms\Components\TextInput::make('compare_at_price')
                                    ->label('Ancien Prix')
                                    ->numeric(),
                                Forms\Components\TextInput::make('sku')
                                    ->label('SKU')
                                    ->default(fn () => 'ATH-' . strtoupper(Str::random(6)))
                                    ->required(),
                                Forms\Components\TextInput::make('stock')
                                    ->label('Stock')
                                    ->numeric()
                                    ->default(100)
                                    ->required(),
                            ])
                            ->columns(5),
                    ]),

                // 7. MARKETING & SEO
                Forms\Components\Tabs::make('Plus de détails')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Recommandations')
                            ->schema([
                                Forms\Components\Select::make('relatedProducts')
                                    ->relationship('relatedProducts', 'name')
                                    ->multiple()
                                    ->searchable()
                                    ->preload(),
                                Forms\Components\TextInput::make('badge_label')
                                    ->label('Badge Promo'),
                                Forms\Components\ColorPicker::make('badge_color')
                                    ->label('Couleur du Badge'),
                            ]),
                        Forms\Components\Tabs\Tab::make('SEO')
                            ->schema([
                                Forms\Components\TextInput::make('meta_title'),
                                Forms\Components\Textarea::make('meta_description'),
                            ]),
                    ])
                    ->columnSpanFull(),
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
                Tables\Columns\TextColumn::make('collection_label')
                    ->label('Collection')
                    ->badge()
                    ->getStateUsing(function (Product $record) {
                        if ($record->is_pack) {
                            return $record->is_custom_pack ? 'Pack (Custom)' : 'Pack (Fixe)';
                        }
                        if ($record->is_niche) return 'Niche';
                        return 'Standard';
                    })
                    ->color(fn ($state) => match(true) {
                        str_contains($state, 'Pack') => 'info',
                        $state === 'Niche' => 'gray',
                        default => 'success',
                    }),
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
        return parent::getEloquentQuery()
            ->with(['category.parent.parent'])
            ->withSum('variants', 'stock');
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

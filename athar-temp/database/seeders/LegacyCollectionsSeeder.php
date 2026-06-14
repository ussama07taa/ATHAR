<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class LegacyCollectionsSeeder extends Seeder
{
    public function run(): void
    {
        $oud = Category::updateOrCreate(
            ['slug' => 'oud'],
            [
                'name'        => 'Oud Collection',
                'description' => 'Notes boisées, oud sauvage et profondeur orientale.',
                'sort_order'  => 10,
                'is_visible'  => true,
            ]
        );

        $floral = Category::updateOrCreate(
            ['slug' => 'floral'],
            [
                'name'        => 'Floral Collection',
                'description' => 'Roses, fleurs blanches et élégance florale.',
                'sort_order'  => 11,
                'is_visible'  => true,
            ]
        );

        $packs = Category::updateOrCreate(
            ['slug' => 'packs'],
            [
                'name'        => 'Packs Découverte',
                'description' => 'Miniatures 10ml & 20ml pour tester nos parfums.',
                'sort_order'  => 12,
                'is_visible'  => true,
            ]
        );

        // ── Signature perfumes ──────────────────────────────────────
        $oudProduct = Product::updateOrCreate(
            ['slug' => 'oud-sauvage'],
            [
                'category_id' => $oud->id,
                'name'        => 'Oud Sauvage',
                'description' => 'A bold and smoky oud with wild woody notes.',
                'is_pack'     => false,
                'is_active'   => true,
            ]
        );

        ProductVariant::updateOrCreate(
            ['sku' => 'OUD-SAU-50'],
            ['product_id' => $oudProduct->id, 'size' => '50ml', 'price' => 280.00, 'stock' => 50]
        );
        ProductVariant::updateOrCreate(
            ['sku' => 'OUD-SAU-100'],
            ['product_id' => $oudProduct->id, 'size' => '100ml', 'price' => 450.00, 'stock' => 30]
        );

        $roseProduct = Product::updateOrCreate(
            ['slug' => 'rose-dades'],
            [
                'category_id' => $floral->id,
                'name'        => 'Rose Dades',
                'description' => 'A fresh and floral rose from the Dades valley.',
                'is_pack'     => false,
                'is_active'   => true,
            ]
        );

        ProductVariant::updateOrCreate(
            ['sku' => 'ROS-DAD-50'],
            ['product_id' => $roseProduct->id, 'size' => '50ml', 'price' => 220.00, 'stock' => 40]
        );

        // ── Discovery packs (10ml & 20ml) ───────────────────────────
        $packOud = Product::updateOrCreate(
            ['slug' => 'pack-oud-decouverte'],
            [
                'category_id'  => $packs->id,
                'name'         => 'Pack Oud Découverte',
                'description'  => 'Découvrez nos notes oud en format voyage.',
                'is_pack'      => true,
                'is_active'    => true,
                'badge_label'  => 'PACK',
                'badge_color'  => '#C8A25C',
            ]
        );

        ProductVariant::updateOrCreate(
            ['sku' => 'PACK-OUD-10'],
            ['product_id' => $packOud->id, 'size' => '10ml', 'price' => 89.00, 'stock' => 100]
        );
        ProductVariant::updateOrCreate(
            ['sku' => 'PACK-OUD-20'],
            ['product_id' => $packOud->id, 'size' => '20ml', 'price' => 149.00, 'stock' => 80]
        );

        $packFloral = Product::updateOrCreate(
            ['slug' => 'pack-floral-decouverte'],
            [
                'category_id'  => $packs->id,
                'name'         => 'Pack Floral Découverte',
                'description'  => 'Un assortiment floral en mini format.',
                'is_pack'      => true,
                'is_active'    => true,
                'badge_label'  => 'PACK',
                'badge_color'  => '#C8A25C',
            ]
        );

        ProductVariant::updateOrCreate(
            ['sku' => 'PACK-FLR-10'],
            ['product_id' => $packFloral->id, 'size' => '10ml', 'price' => 79.00, 'stock' => 100]
        );
        ProductVariant::updateOrCreate(
            ['sku' => 'PACK-FLR-20'],
            ['product_id' => $packFloral->id, 'size' => '20ml', 'price' => 129.00, 'stock' => 80]
        );

        $this->command->info('✅ Collections (Oud, Floral, Packs) and pack products seeded.');
    }
}

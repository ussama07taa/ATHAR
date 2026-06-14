<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        DB::table('categories')->truncate();
        DB::table('products')->truncate();
        DB::table('product_variants')->truncate();
        DB::table('orders')->truncate();
        DB::table('order_items')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 0. Create Admin User
        \App\Models\User::create([
            'name'     => 'Admin',
            'email'    => 'admin@athar.ma',
            'password' => bcrypt('password'),
        ]);

        // 1. Create Parfums category tree
        $parfums = Category::create([
            'name'       => 'Parfums',
            'slug'       => 'parfums',
            'sort_order' => 0,
            'is_visible' => true,
        ]);

        $femmes = Category::create([
            'parent_id'  => $parfums->id,
            'name'       => 'Femmes',
            'slug'       => 'femmes',
            'sort_order' => 0,
            'is_visible' => true,
        ]);

        $hommes = Category::create([
            'parent_id'  => $parfums->id,
            'name'       => 'Hommes',
            'slug'       => 'hommes',
            'sort_order' => 1,
            'is_visible' => true,
        ]);

        $femmesSubcategories = [
            ['name' => 'Eau de parfum', 'slug' => 'femmes-eau-de-parfum', 'sort_order' => 0],
            ['name' => 'Eau de toilette', 'slug' => 'femmes-eau-de-toilette', 'sort_order' => 1],
            ['name' => 'Déodorants & sprays pour le corps', 'slug' => 'femmes-deodorants-sprays', 'sort_order' => 2],
            ['name' => 'Coffrets', 'slug' => 'femmes-coffrets', 'sort_order' => 3],
        ];

        $hommesSubcategories = [
            ['name' => 'Eau de parfum', 'slug' => 'hommes-eau-de-parfum', 'sort_order' => 0],
            ['name' => 'Eau de toilette', 'slug' => 'hommes-eau-de-toilette', 'sort_order' => 1],
            ['name' => 'Déodorants & sprays pour le corps', 'slug' => 'hommes-deodorants-sprays', 'sort_order' => 2],
            ['name' => 'Coffrets', 'slug' => 'hommes-coffrets', 'sort_order' => 3],
        ];

        $femmesEauDeParfum = null;
        foreach ($femmesSubcategories as $sub) {
            $cat = Category::create(array_merge($sub, [
                'parent_id'  => $femmes->id,
                'is_visible' => true,
            ]));
            if ($sub['slug'] === 'femmes-eau-de-parfum') {
                $femmesEauDeParfum = $cat;
            }
        }

        $hommesEauDeParfum = null;
        foreach ($hommesSubcategories as $sub) {
            $cat = Category::create(array_merge($sub, [
                'parent_id'  => $hommes->id,
                'is_visible' => true,
            ]));
            if ($sub['slug'] === 'hommes-eau-de-parfum') {
                $hommesEauDeParfum = $cat;
            }
        }

        // Legacy collections (homepage grid — not Parfums nav)
        $oud    = Category::create(['name' => 'Oud Collection', 'slug' => 'oud', 'sort_order' => 10, 'is_visible' => true, 'description' => 'Notes boisées, oud sauvage et profondeur orientale.']);
        $floral = Category::create(['name' => 'Floral Collection', 'slug' => 'floral', 'sort_order' => 11, 'is_visible' => true, 'description' => 'Roses, fleurs blanches et élégance florale.']);
        $packs  = Category::create(['name' => 'Packs Découverte', 'slug' => 'packs', 'sort_order' => 12, 'is_visible' => true, 'description' => 'Miniatures 10ml & 20ml pour tester nos parfums.']);

        // 2. Create Products
        $p1 = Product::create([
            'category_id' => $oud->id,
            'name'        => 'Oud Sauvage',
            'slug'        => 'oud-sauvage',
            'description' => 'A bold and smoky oud with wild woody notes.',
            'is_pack'     => false,
        ]);

        $p2 = Product::create([
            'category_id' => $femmesEauDeParfum->id,
            'name'        => 'Rose Dades',
            'slug'        => 'rose-dades-parfum',
            'description' => 'A fresh and floral rose from the Dades valley — Eau de parfum femme.',
            'is_pack'     => false,
        ]);

        $p3 = Product::create([
            'category_id' => $hommesEauDeParfum->id,
            'name'        => 'Musc Atlas',
            'slug'        => 'musc-atlas-parfum',
            'description' => 'A soft and warm musk inspired by the Atlas mountains — Eau de parfum homme.',
            'is_pack'     => false,
        ]);

        // Pack products (10ml & 20ml)
        $packOud = Product::create([
            'category_id' => $packs->id,
            'name'        => 'Pack Oud Découverte',
            'slug'        => 'pack-oud-decouverte',
            'description' => 'Découvrez nos notes oud en format voyage.',
            'is_pack'     => true,
            'badge_label' => 'PACK',
            'badge_color' => '#C8A25C',
        ]);

        $packFloral = Product::create([
            'category_id' => $packs->id,
            'name'        => 'Pack Floral Découverte',
            'slug'        => 'pack-floral-decouverte',
            'description' => 'Un assortiment floral en mini format.',
            'is_pack'     => true,
            'badge_label' => 'PACK',
            'badge_color' => '#C8A25C',
        ]);

        // 3. Create Variants for Oud Sauvage
        ProductVariant::create([
            'product_id' => $p1->id,
            'size'       => '50ml',
            'price'      => 280.00,
            'stock'      => 50,
            'sku'        => 'OUD-SAU-50',
        ]);
        ProductVariant::create([
            'product_id' => $p1->id,
            'size'       => '100ml',
            'price'      => 450.00,
            'stock'      => 30,
            'sku'        => 'OUD-SAU-100',
        ]);

        // Variants for Rose Dades
        ProductVariant::create([
            'product_id' => $p2->id,
            'size'       => '50ml',
            'price'      => 220.00,
            'stock'      => 40,
            'sku'        => 'ROS-DAD-50',
        ]);

        // Variants for Musc Atlas
        ProductVariant::create([
            'product_id' => $p3->id,
            'size'       => '50ml',
            'price'      => 195.00,
            'stock'      => 60,
            'sku'        => 'MUS-ATL-50',
        ]);

        // Pack Oud — 10ml & 20ml
        ProductVariant::create(['product_id' => $packOud->id, 'size' => '10ml', 'price' => 89.00, 'stock' => 100, 'sku' => 'PACK-OUD-10']);
        ProductVariant::create(['product_id' => $packOud->id, 'size' => '20ml', 'price' => 149.00, 'stock' => 80, 'sku' => 'PACK-OUD-20']);

        // Pack Floral — 10ml & 20ml
        ProductVariant::create(['product_id' => $packFloral->id, 'size' => '10ml', 'price' => 79.00, 'stock' => 100, 'sku' => 'PACK-FLR-10']);
        ProductVariant::create(['product_id' => $packFloral->id, 'size' => '20ml', 'price' => 129.00, 'stock' => 80, 'sku' => 'PACK-FLR-20']);

        // 4. Create Dummy Order
        $order = \App\Models\Order::create([
            'order_number'   => 'ATH-TEST77',
            'customer_name'  => 'Ahmed Taaouati',
            'customer_phone' => '0661234567',
            'customer_city'  => 'Marrakech',
            'total_amount'   => 280.00,
            'status'         => 'confirmed',
        ]);

        \App\Models\OrderItem::create([
            'order_id'           => $order->id,
            'product_variant_id' => 1,
            'quantity'           => 1,
            'unit_price'         => 280.00,
        ]);

        $this->command->info('✅ Categories, Products, Variants, and a Test Order seeded successfully.');
    }
}

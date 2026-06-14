<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class ParfumsCategorySeeder extends Seeder
{
    public function run(): void
    {
        $parfums = Category::updateOrCreate(
            ['slug' => 'parfums'],
            ['name' => 'Parfums', 'sort_order' => 0, 'is_visible' => true, 'is_featured' => false]
        );

        $femmes = Category::updateOrCreate(
            ['slug' => 'femmes'],
            ['parent_id' => $parfums->id, 'name' => 'Femmes', 'sort_order' => 0, 'is_visible' => true, 'is_featured' => false]
        );

        $hommes = Category::updateOrCreate(
            ['slug' => 'hommes'],
            ['parent_id' => $parfums->id, 'name' => 'Hommes', 'sort_order' => 1, 'is_visible' => true, 'is_featured' => false]
        );

        $parfumTypes = [
            ['name' => 'Eau de parfum', 'slug_suffix' => 'eau-de-parfum', 'sort_order' => 0],
            ['name' => 'Eau de toilette', 'slug_suffix' => 'eau-de-toilette', 'sort_order' => 1],
            ['name' => 'Déodorants & sprays pour le corps', 'slug_suffix' => 'deodorants-sprays', 'sort_order' => 2],
            ['name' => 'Coffrets', 'slug_suffix' => 'coffrets', 'sort_order' => 3],
        ];

        foreach (['femmes' => $femmes, 'hommes' => $hommes] as $genderSlug => $parent) {
            foreach ($parfumTypes as $type) {
                Category::updateOrCreate(
                    ['slug' => "{$genderSlug}-{$type['slug_suffix']}"],
                    [
                        'parent_id'  => $parent->id,
                        'name'       => $type['name'],
                        'sort_order' => $type['sort_order'],
                        'is_visible' => true,
                        'is_featured' => false,
                    ]
                );
            }
        }

        // Masquer tout l'ancien système "Collections" séparé
        $collectionsSlugs = Category::where('slug', 'collections')
            ->orWhere('slug', 'like', 'col-%')
            ->orWhereIn('slug', ['parfum-complet', 'parfum-niche', 'oud', 'floral', 'packs'])
            ->pluck('id');

        Category::whereIn('id', $collectionsSlugs)
            ->orWhereIn('parent_id', $collectionsSlugs)
            ->update(['is_visible' => false, 'is_featured' => false]);

        $this->command->info('✅ Parfums (Femmes/Hommes) seeded. Collections masquées.');
    }
}

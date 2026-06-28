<?php

use App\Models\Product;
use App\Models\Category;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$products = Product::with('category')->get();

echo "Updating product genders...\n";

foreach ($products as $product) {
    $newGender = 'unisex'; // Default fallback

    // 1. Check Category tree
    if ($product->category) {
        $ancestors = $product->category->getAncestors();
        $pathSlugs = array_map(fn($a) => $a->slug, $ancestors);
        $pathSlugs[] = $product->category->slug;

        if (in_array('femmes', $pathSlugs) || collect($pathSlugs)->contains(fn($s) => str_starts_with($s, 'femmes'))) {
            $newGender = 'femme';
        } elseif (in_array('hommes', $pathSlugs) || collect($pathSlugs)->contains(fn($s) => str_starts_with($s, 'hommes'))) {
            $newGender = 'homme';
        }
    }

    // 2. Fallback to Name for Packs
    if ($newGender === 'unisex') {
        $name = strtoupper($product->name);
        if (str_contains($name, 'HOMME')) {
            $newGender = 'homme';
        } elseif (str_contains($name, 'FEMME')) {
            $newGender = 'femme';
        }
    }

    if ($product->gender !== $newGender) {
        echo "Updating [{$product->id}] {$product->name}: {$product->gender} -> {$newGender}\n";
        $product->update(['gender' => $newGender]);
    }
}

echo "Done!\n";

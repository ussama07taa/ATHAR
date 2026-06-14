<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use Database\Seeders\BrandSeeder;
use Database\Seeders\ParfumsCategorySeeder;
use Illuminate\Console\Command;

class RepairCategoriesCommand extends Command
{
    protected $signature = 'categories:repair {--assign-orphans : Assign orphan products to hommes-eau-de-parfum}';

    protected $description = 'Restore Parfums category tree and optionally fix products without category';

    public function handle(): int
    {
        $this->info('Restoring Parfums / Femmes / Hommes tree...');
        $this->call('db:seed', ['--class' => ParfumsCategorySeeder::class, '--force' => true]);

        $this->info('Restoring default brands...');
        $this->call('db:seed', ['--class' => BrandSeeder::class, '--force' => true]);

        $orphans = Product::query()->whereNull('category_id')->count();

        if ($orphans > 0) {
            $this->warn("{$orphans} produit(s) sans catégorie détecté(s).");

            if ($this->option('assign-orphans')) {
                $fallback = Category::query()
                    ->where('slug', 'hommes-eau-de-parfum')
                    ->first();

                if ($fallback) {
                    Product::query()
                        ->whereNull('category_id')
                        ->update(['category_id' => $fallback->id]);
                    $this->info("Produits orphelins assignés à « {$fallback->name} ».");
                } else {
                    $this->error('Catégorie hommes-eau-de-parfum introuvable.');

                    return self::FAILURE;
                }
            } else {
                $this->line('Relancez avec --assign-orphans pour les corriger automatiquement.');
            }
        } else {
            $this->info('Aucun produit orphelin.');
        }

        $this->newLine();
        $this->table(
            ['Univers', 'Types visibles'],
            collect(['femmes', 'hommes'])->map(function (string $slug) {
                $gender = Category::where('slug', $slug)->first();

                $count = $gender
                    ? Category::where('parent_id', $gender->id)->where('is_visible', true)->count()
                    : 0;

                return [$slug, $count];
            })->all(),
        );

        $this->info('✅ Réparation terminée.');

        return self::SUCCESS;
    }
}

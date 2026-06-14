<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'Athar',
            'Armani Privé',
            'Chanel',
            'Dior',
            'Guerlain',
            'Hermès',
            'Tom Ford',
            'Versace',
            'YSL',
        ];

        foreach ($brands as $i => $name) {
            Brand::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true, 'sort_order' => $i + 1],
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\PromoCode;
use Illuminate\Database\Seeder;

class PromoCodeSeeder extends Seeder
{
    public function run(): void
    {
        PromoCode::updateOrCreate(
            ['code' => 'ATHAR10'],
            [
                'type'             => PromoCode::TYPE_PERCENTAGE,
                'value'            => 10,
                'min_order_amount' => 200,
                'max_uses'         => null,
                'is_active'        => true,
            ],
        );

        PromoCode::updateOrCreate(
            ['code' => 'BIENVENUE50'],
            [
                'type'             => PromoCode::TYPE_FIXED,
                'value'            => 50,
                'min_order_amount' => 300,
                'max_uses'         => 100,
                'is_active'        => true,
            ],
        );

        $this->command->info('✅ Codes promo ATHAR10 et BIENVENUE50 créés.');
    }
}

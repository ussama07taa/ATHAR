<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            ['customer_name' => 'Nadia B.', 'customer_city' => 'Casablanca', 'rating' => 5, 'comment' => 'Waw, c\'est vraiment un parfum exceptionnel. La tenue est incroyable — j\'en ai encore le soir alors que je l\'ai mis le matin.', 'is_approved' => true, 'is_featured' => true],
            ['customer_name' => 'Youssef M.', 'customer_city' => 'Marrakech', 'rating' => 5, 'comment' => 'Livraison rapide, emballage luxueux et le parfum est divin. J\'ai commandé en COD — 0 problème, très professionnel.', 'is_approved' => true, 'is_featured' => true],
            ['customer_name' => 'Salma K.', 'customer_city' => 'Rabat', 'rating' => 5, 'comment' => 'Je cherchais un oud qui ne soit pas trop fort — Athar a exactement ce qu\'il faut. Délicat, élégant, longue durée.', 'is_approved' => true, 'is_featured' => true],
            ['customer_name' => 'Hamza R.', 'customer_city' => 'Tanger', 'rating' => 5, 'comment' => 'Cadeau pour ma femme — elle était absolument ravie. La présentation est magnifique et le parfum est sublime.', 'is_approved' => true, 'is_featured' => true],
        ];

        foreach ($reviews as $review) {
            Review::updateOrCreate(
                ['customer_name' => $review['customer_name'], 'comment' => $review['comment']],
                $review,
            );
        }

        $this->command->info('✅ Avis clients créés.');
    }
}

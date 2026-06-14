<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_related', function (Blueprint $box) {
            $box->id();
            $box->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $box->foreignId('related_id')->constrained('products')->cascadeOnDelete();
            $box->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_related');
    }
};

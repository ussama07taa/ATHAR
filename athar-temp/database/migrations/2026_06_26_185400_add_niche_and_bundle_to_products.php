<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_niche')->default(false)->after('is_pack');
        });

        Schema::create('bundle_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bundle_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bundle_product');
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_niche');
        });
    }
};

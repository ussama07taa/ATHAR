<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Re-allow null category_id for the new polymorphic/pack architecture
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // If we need to go back, we'd make it non-nullable again
        // But for standard products, the observer already handles validation
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable(false)->change();
        });
    }
};

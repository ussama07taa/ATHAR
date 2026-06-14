<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_address')->nullable()->after('customer_city');
            $table->string('customer_quartier')->nullable()->after('customer_address');
            $table->decimal('shipping_amount', 10, 2)->default(0)->after('discount_amount');
            $table->boolean('stock_adjusted')->default(true)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['customer_address', 'customer_quartier', 'shipping_amount', 'stock_adjusted']);
        });
    }
};

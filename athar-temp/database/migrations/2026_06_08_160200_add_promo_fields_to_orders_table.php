<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal_amount', 10, 2)->nullable()->after('customer_city');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('subtotal_amount');
            $table->string('promo_code')->nullable()->after('discount_amount');
        });

        DB::table('orders')->whereNull('subtotal_amount')->update([
            'subtotal_amount' => DB::raw('total_amount'),
        ]);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['subtotal_amount', 'discount_amount', 'promo_code']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $box) {
            $box->index('status');
            $box->index('customer_phone');
            $box->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $box) {
            $box->dropIndex(['status']);
            $box->dropIndex(['customer_phone']);
            $box->dropIndex(['created_at']);
        });
    }
};

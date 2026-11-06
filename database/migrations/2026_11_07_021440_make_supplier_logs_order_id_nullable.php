<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('supplier_logs', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });

        Schema::table('supplier_logs', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable()->change();
            $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('supplier_logs', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });

        Schema::table('supplier_logs', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable(false)->change();
            $table->foreign('order_id')->references('id')->on('orders')->cascadeOnDelete();
        });
    }
};

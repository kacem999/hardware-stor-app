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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_name')->after('status');
            $table->string('customer_phone')->after('customer_name');
            $table->string('wilaya')->after('customer_phone');
            $table->string('commune')->after('wilaya');
            $table->string('address')->after('commune');

            // Remove the old columns
            $table->dropColumn(['shipping_address_line_1', 'shipping_address_line_2', 'city', 'postal_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_address_line_1');
            $table->string('shipping_address_line_2')->nullable();
            $table->string('city');
            $table->string('postal_code');

            // Drop the new columns
            $table->dropColumn(['customer_name', 'customer_phone', 'wilaya', 'commune', 'address']);
        });
    }
};

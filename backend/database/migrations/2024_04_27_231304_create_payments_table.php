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
        Schema::create('payments', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascade('delete');
            $table->foreignId('booking_id')->constrained('bookings')->cascade('delete');
            $table->decimal('amount', 8, 2);  
            $table->date('payment_date');
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->foreignId('payment_id')->constrained('payments');
            $table->decimal('amount', 8, 2);                                                                  
            $table->longText('reference_text');                  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('transactions');
    }
};

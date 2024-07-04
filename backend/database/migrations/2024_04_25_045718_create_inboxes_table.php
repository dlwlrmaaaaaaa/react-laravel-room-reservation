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
        Schema::create('inboxes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('sender_email');
            $table->foreign('sender_email')->references('email')->on('users')->onDelete('cascade');
            $table->string('receiver_email');
            $table->foreign('receiver_email')->references('email')->on('users')->onDelete('cascade');
            $table->string('message');
            $table->dateTime('message_date');
            $table->timestamp('message_sent')->default(now());
            $table->timestamp('message_received')->default(now());
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inbox');
    }
};
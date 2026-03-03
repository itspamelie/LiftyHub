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
        Schema::create('user_streaks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->integer('current_streak')->default(0);
    $table->integer('longest_streak')->default(0);
    $table->date('last_training_date')->nullable();
    $table->timestamps();
});
    }

    public function down(): void
    {
        //
    }
};

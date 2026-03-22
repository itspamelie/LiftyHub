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
        Schema::create('diet_requests', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
          ->constrained()
          ->onDelete('cascade');

    $table->foreignId('nutritionist_id')
          ->constrained('users')
          ->onDelete('cascade');

    $table->year('year');
    $table->tinyInteger('month');

    $table->enum('status', [
        'pending',     // solicitada
        'paid',        // pagada
        'in_progress', // nutriólogo trabajando
        'completed',   // dieta entregada
        'cancelled'
    ])->default('pending');

    $table->timestamps();

    // REGLA: 1 nutriólogo por mes
    $table->unique(['user_id', 'year', 'month']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

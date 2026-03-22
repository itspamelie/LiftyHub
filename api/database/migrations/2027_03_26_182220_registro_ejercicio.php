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
Schema::create('exercise_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users');
    $table->foreignId('exercise_id')->constrained('exercises');
    $table->decimal('weight_lifted',8,2);
    $table->integer('repetitions');
    $table->integer('sets');
    $table->foreignId('exercise_routine_id')->nullable()->constrained('exercise_routines');
    $table->date('workout_date');
    $table->foreignId('user_routine_session_id')
          ->nullable()
          ->constrained('user_routine_sessions')
          ->onDelete('cascade');
    $table->timestamps();
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

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_routine_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_routine_id')->constrained('user_routines')->onDelete('cascade');
            $table->foreignId('exercise_id')->constrained('exercises')->onDelete('cascade');
            $table->integer('sets');
            $table->integer('repetitions');
            $table->integer('seconds_rest');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_routine_exercises');
    }
};

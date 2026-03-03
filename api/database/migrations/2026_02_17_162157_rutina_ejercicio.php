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
        Schema::create('exercise_routines', function (Blueprint $table) {
    $table->id();
    $table->foreignId('routine_id')->constrained('routines')->onDelete('cascade');
    $table->foreignId('exercise_id')->constrained('exercises')->onDelete('cascade');
    $table->integer('sets');
    $table->integer('repetitions');
    $table->integer('seconds_rest');
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

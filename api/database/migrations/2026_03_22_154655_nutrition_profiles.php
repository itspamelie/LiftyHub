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
        Schema::create('nutrition_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');

    $table->decimal('weight', 5,2);
    $table->integer('age');
    $table->decimal('height', 5,2);
    $table->string('meal_schedule')->nullable(); // horarios
    $table->text('favorite_foods')->nullable();
    $table->text('disliked_foods')->nullable();
    $table->text('allergies')->nullable();
    $table->text('medical_restrictions')->nullable();
    $table->string('favorite_meal')->nullable(); // comida favorita
    $table->boolean('can_cook_sunday')->default(false);

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

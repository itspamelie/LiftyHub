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
        Schema::create('meals', function (Blueprint $table) {
    $table->id();
    $table->foreignId('plan_day_id')->constrained()->onDelete('cascade');

    $table->string('name'); // Desayuno
    $table->integer('calories');
    $table->string('image')->nullable();
$table->integer('order');
$table->text('description'); // qué incluye la comida
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

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
        Schema::create('supplements', function (Blueprint $table) {
    $table->id();

    $table->foreignId('plan_day_id') // 🔥 CAMBIO IMPORTANTE
          ->constrained()
          ->onDelete('cascade');

    $table->string('name'); // Whey, Creatina
    $table->string('amount'); // 30g
    $table->string('instructions'); // después de entrenar
    $table->string('image')->nullable();
    $table->string('color')->nullable();
    $table->integer('order')->nullable();
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

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
        Schema::create('nutritionist_experiences', function (Blueprint $table) {
    $table->id();
    $table->foreignId('nutritionist_profile_id')
          ->constrained('nutritionist_profiles')
          ->onDelete('cascade');

    $table->string('title'); // Nutricionista deportiva
    $table->string('company'); // LiftyHub
    $table->year('start_year');
    $table->year('end_year')->nullable(); // null = presente

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

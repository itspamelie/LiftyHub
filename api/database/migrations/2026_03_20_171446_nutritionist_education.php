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
        Schema::create('nutritionist_educations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('nutritionist_profile_id')
          ->constrained('nutritionist_profiles')
          ->onDelete('cascade');

    $table->string('degree'); // Maestría
    $table->string('institution'); // Universidad
    $table->year('year');

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

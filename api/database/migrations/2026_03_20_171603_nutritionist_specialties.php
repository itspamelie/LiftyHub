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
        Schema::create('nutritionist_specialty', function (Blueprint $table) {
    $table->id();

    $table->foreignId('nutritionist_profile_id')
          ->constrained()
          ->onDelete('cascade');

    $table->foreignId('specialty_id')
          ->constrained()
          ->onDelete('cascade');
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

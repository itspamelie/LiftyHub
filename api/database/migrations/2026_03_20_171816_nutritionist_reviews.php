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
         Schema::create('nutritionist_reviews', function (Blueprint $table) {
            $table->id();

            $table->foreignId('nutritionist_profile_id')
                  ->constrained('nutritionist_profiles')
                  ->onDelete('cascade');

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->integer('rating'); // 1-5
            $table->text('comment')->nullable();

            $table->timestamps();

            // Evita que un usuario califique dos veces al mismo nutriólogo
            $table->unique(['nutritionist_profile_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
                Schema::dropIfExists('nutritionist_reviews');

    }
};

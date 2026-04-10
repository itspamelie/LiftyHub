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
         Schema::create('user_week_plans', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->tinyInteger('day_index'); // 0=Lunes, 6=Domingo
        $table->enum('type', ['routine', 'rest']);
        $table->unsignedBigInteger('routine_id')->nullable();
        $table->unsignedBigInteger('user_routine_id')->nullable();
        $table->string('routine_name')->nullable();
        $table->timestamps();

        $table->unique(['user_id', 'day_index']);
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

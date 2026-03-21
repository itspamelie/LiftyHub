<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('objective');
            $table->string('level');
            $table->integer('duration');
            $table->string('img')->nullable();
            $table->timestamps();
            $table->string('category')->nullable();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_routines');
    }
};

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
Schema::create('routines', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('objective');
    $table->string('level');
    $table->integer('duration');
    $table->string('img');
    $table->foreignId('plan_id')->constrained('plans')->onDelete('cascade');
    $table->foreignId('somatotype_id')->constrained('somatotypes');
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

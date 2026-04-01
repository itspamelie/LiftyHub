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
         Schema::create('user_properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users');           
            $table->decimal('stature',5,2);
            $table->decimal('weight',5,2);
            $table->decimal('waist',5,2)->nullable();
            $table->decimal('chest',5,2)->nullable();
            $table->decimal('hips',5,2)->nullable();
            $table->decimal('arms',5,2)->nullable();
            $table->decimal('shoulders',5,2)->nullable();
            $table->decimal('thighs',5,2)->nullable();
            $table->string('objective');
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

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
        Schema::create('user_schedule', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');

    // puede ser rutina del sistema
    $table->foreignId('routine_id')->nullable()->constrained()->onDelete('cascade');

    // o rutina del usuario
    $table->foreignId('user_routine_id')->nullable()->constrained()->onDelete('cascade');

    $table->enum('day_of_week', [
        'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
    ]);
$table->unique(['user_id', 'day_of_week']);
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

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
       Schema::create('plan_days', function (Blueprint $table) {
    $table->id();
    $table->foreignId('diet_plan_id')->constrained()->onDelete('cascade');

    $table->enum('day', [
        'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
    ]);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_days');
    }
};

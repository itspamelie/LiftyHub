<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
Schema::create('nutritionist_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

    $table->string('license_number')->nullable();
    $table->string('profile_pic')->nullable();

    $table->string('specialty')->nullable();
    $table->string('location')->nullable();

    $table->text('bio')->nullable();

    $table->decimal('rating', 2, 1)->default(0);
    $table->integer('reviews_count')->default(0);

    $table->boolean('is_active')->default(true);

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

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DietReviewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('diet_reviews')->insert([
            [
                'diet_plan_id' => 1,
                'rating' => 5,
                'comment' => 'Excelente plan, fácil de seguir',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

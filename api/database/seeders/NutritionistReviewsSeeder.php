<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class NutritionistReviewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          DB::table('nutritionist_reviews')->insert([
            [
                'nutritionist_profile_id'=>1,
                'user_id'=>3,
                'rating'=>5,
                'comment'=>'Excelente nutriólogo, me ayudó a lograr mis objetivos.',
                'created_at'=>now(),
                'updated_at'=>now()
            ],
            [
                'nutritionist_profile_id'=>1,
                'user_id'=>4,
                'rating'=>4,
                'comment'=>'Buen servicio, planes claros y efectivos.',
                'created_at'=>now(),
                'updated_at'=>now()
            ]
        ]);
    }
}

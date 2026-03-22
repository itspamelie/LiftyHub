<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class NutritionistExperiencesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('nutritionist_experiences')->insert([
            [
                'nutritionist_profile_id'=>1,
                'title'=>'Nutriólogo deportivo',
                'company'=>'LiftyHub',
                'start_year'=>2021,
                'end_year'=>null,
                'created_at'=>now(),
                'updated_at'=>now()
            ],
            [
                'nutritionist_profile_id'=>1,
                'title'=>'Asesor nutricional',
                'company'=>'Gym PowerFit',
                'start_year'=>2019,
                'end_year'=>2021,
                'created_at'=>now(),
                'updated_at'=>now()
            ]
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NutritionistEducationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('nutritionist_educations')->insert([
            [
                'nutritionist_profile_id'=>1,
                'degree'=>'Licenciatura en Nutrición',
                'institution'=>'Universidad Autónoma de Chihuahua',
                'year'=>2018,
                'created_at'=>now(),
                'updated_at'=>now()
            ],
            [
                'nutritionist_profile_id'=>1,
                'degree'=>'Maestría en Nutrición Deportiva',
                'institution'=>'Instituto Nacional de Ciencias del Deporte',
                'year'=>2021,
                'created_at'=>now(),
                'updated_at'=>now()
            ]
        ]);
    }
}

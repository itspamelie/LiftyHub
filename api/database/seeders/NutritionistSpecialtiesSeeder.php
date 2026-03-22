<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class NutritionistSpecialtiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('nutritionist_specialties')->insert([
            ['nutritionist_profile_id'=>1,'specialty_id'=>1],
            ['nutritionist_profile_id'=>1,'specialty_id'=>2],
            ['nutritionist_profile_id'=>1,'specialty_id'=>3],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RecommendationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    DB::table('recommendations')->insert([
            [
                'diet_plan_id' => 1,
                'text' => 'Beber mínimo 2 litros de agua al día',
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'diet_plan_id' => 1,
                'text' => 'Evitar alimentos ultraprocesados',
                'order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'diet_plan_id' => 1,
                'text' => 'Dormir al menos 7-8 horas',
                'order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

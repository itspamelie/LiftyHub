<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MealsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $planDays = DB::table('plan_days')->get();

foreach ($planDays as $day) {

    DB::table('meals')->insert([
        [
            'plan_day_id' => $day->id,
            'name' => 'Desayuno',
            'calories' => 400,
            'description' => 'Huevos con avena y fruta',
            'order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'plan_day_id' => $day->id,
            'name' => 'Snack mañana',
            'calories' => 200,
            'description' => 'Yogurt con nueces',
            'order' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'plan_day_id' => $day->id,
            'name' => 'Comida',
            'calories' => 600,
            'description' => 'Pollo con arroz y verduras',
            'order' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'plan_day_id' => $day->id,
            'name' => 'Snack tarde',
            'calories' => 200,
            'description' => 'Fruta con crema de cacahuate',
            'order' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'plan_day_id' => $day->id,
            'name' => 'Cena',
            'calories' => 500,
            'description' => 'Atún con ensalada',
            'order' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
}
    }
}

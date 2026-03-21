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
        for ($day = 1; $day <= 7; $day++) {

            DB::table('meals')->insert([
                [
                    'plan_day_id' => $day,
                    'name' => 'Desayuno',
                    'calories' => 400,
                    'order' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'plan_day_id' => $day,
                    'name' => 'Snack mañana',
                    'calories' => 200,
                    'order' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'plan_day_id' => $day,
                    'name' => 'Comida',
                    'calories' => 600,
                    'order' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'plan_day_id' => $day,
                    'name' => 'Snack tarde',
                    'calories' => 200,
                    'order' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'plan_day_id' => $day,
                    'name' => 'Cena',
                    'calories' => 500,
                    'order' => 5,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}

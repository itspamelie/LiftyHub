<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class MonthlyProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('monthly_progress')->insert([
            [
                'user_id' => 3,
                'year' => 2026,
                'month_number' => 3,
                'initial_weight' => 75,
                'current_weight' => 72,
                'observations' => 'Bajó grasa, ganó músculo',
                'img' => 'progress1.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 4,
                'year' => 2026,
                'month_number' => 3,
                'initial_weight' => 68,
                'current_weight' => 67,
                'observations' => 'Ligera mejora',
                'img' => 'progress2.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

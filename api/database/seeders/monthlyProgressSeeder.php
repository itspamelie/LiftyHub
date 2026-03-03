<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class monthlyProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
  DB::table('monthly_progress')->insert([
    [
        'user_id' => 2,
        'year' => 2025,
        'month_number' => 1,
        'initial_weight' => 60.50,
        'current_weight' => 59.00,
        'observations' => 'Buen progreso este mes',
        'img' => 'progress1.jpg'
    ],
]);
    }
}

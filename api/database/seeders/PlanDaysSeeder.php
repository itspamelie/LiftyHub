<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanDaysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
$days = ['monday','tuesday','wednesday','thursday','friday'];

foreach ($days as $index => $dayName) {
    DB::table('plan_days')->insert([
        'id' => $index + 1,
        'diet_plan_id' => 1,
        'day' => $dayName,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

        }
    }
}

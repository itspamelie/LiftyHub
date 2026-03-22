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
$dietPlanId = DB::table('diet_plans')->first()->id;

$days = ['monday','tuesday','wednesday','thursday','friday'];

foreach ($days as $day) {
    DB::table('plan_days')->insert([
        'diet_plan_id' => $dietPlanId,
        'day' => $day,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

        }
    }
}

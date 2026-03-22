<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DietPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

$dietPlanId = DB::table('diet_plans')->insertGetId([
    'nutritionist_id' => DB::table('users')->where('role', 'nutritionist')->first()->id,
    'user_id' => DB::table('users')->where('email', 'juan@test.com')->first()->id,
    'is_monodiet' => false,
    'status' => 'active',
    'goal' => 'Hipertrofia',
    'duration_days' => 30,
    'notes' => 'Plan para aumento de masa muscular',
    'created_at' => now(),
    'updated_at' => now(),
]);

// Guardamos el ID para usarlo en otros seeders (opcional si lo separas)
cache(['diet_plan_id' => $dietPlanId]);
    }
}

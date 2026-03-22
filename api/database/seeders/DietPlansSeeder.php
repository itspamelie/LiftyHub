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

DB::table('diet_plans')->insert([
    [
        'id' => 1,
        'diet_request_id' => 1,
        'nutritionist_id' => 2,
        'user_id' => 3,
        'is_monodiet' => false,
        'status' => 'active',
        'goal' => 'definición',
        'duration_days' => 30,
        'notes' => 'Reducir azúcares',
        'created_at' => now(),
        'updated_at' => now(),
    ],
]);
    }
}

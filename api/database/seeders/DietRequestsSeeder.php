<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DietRequestsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
DB::table('diet_requests')->insert([
    // Usuario 3 con nutriólogo 2 (Marzo)
    [
        'id' => 1,
        'user_id' => 3,
        'nutritionist_id' => 2,
        'year' => 2026,
        'month' => 3,
        'status' => 'paid',
        'created_at' => now(),
        'updated_at' => now(),
    ],


]);
    }
}

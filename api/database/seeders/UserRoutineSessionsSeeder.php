<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRoutineSessionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('user_routine_sessions')->insert([
            [
                'id' => 1,
                'user_id' => 3,
                'routine_id' => 1,
                'started_at' => now()->subDays(2),
                'finished_at' => now()->subDays(2)->addHour(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'user_id' => 3,
                'user_routine_id' => 1,
                'started_at' => now()->subDay(),
                'finished_at' => now()->subDay()->addHour(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

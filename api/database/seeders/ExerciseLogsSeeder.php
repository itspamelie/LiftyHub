<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExerciseLogsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('exercise_logs')->insert([
            [
                'user_id' => 3,
                'exercise_id' => 1,
                'weight_lifted' => 80,
                'repetitions' => 10,
                'sets' => 4,
                'exercise_routine_id' => 1,
                'user_routine_session_id' => 1,
                'workout_date' => now()->subDays(2),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

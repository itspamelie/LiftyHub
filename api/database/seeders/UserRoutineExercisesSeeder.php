<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class UserRoutineExercisesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          DB::table('user_routine_exercises')->insert([
            [
                'user_routine_id' => 1,
                'exercise_id' => 1,
                'sets' => 4,
                'repetitions' => 10,
                'seconds_rest' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_routine_id' => 2,
                'exercise_id' => 2,
                'sets' => 3,
                'repetitions' => 15,
                'seconds_rest' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

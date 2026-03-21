<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class exerciseRoutinesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
ExerciseRoutine::insert([
    // PUSH
    ['routine_id'=>1,'exercise_id'=>1,'sets'=>4,'repetitions'=>10,'seconds_rest'=>60],
    ['routine_id'=>1,'exercise_id'=>6,'sets'=>3,'repetitions'=>12,'seconds_rest'=>60],
    ['routine_id'=>1,'exercise_id'=>5,'sets'=>3,'repetitions'=>12,'seconds_rest'=>45],

    // PIERNA
    ['routine_id'=>2,'exercise_id'=>2,'sets'=>4,'repetitions'=>8,'seconds_rest'=>90],
    ['routine_id'=>2,'exercise_id'=>3,'sets'=>4,'repetitions'=>6,'seconds_rest'=>90],
]);
    }
}

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
DB::table('exercise_routines')->insert([
    [
        'routine_id' => 1,
        'exercise_id' => 1,
        'sets' => 4,
        'repetitions' => 12,
        'seconds_rest' => 60
    ],
]);
    }
}

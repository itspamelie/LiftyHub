<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ExerciseRoutinesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('exercise_routines')->insert([

            /*
            ============================
            RUTINA 1: FULL BODY
            ============================
            */

            [
                'routine_id' => 1,
                'exercise_id' => 1, // Press banca
                'sets' => 3,
                'repetitions' => 12,
                'seconds_rest' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'routine_id' => 1,
                'exercise_id' => 2, // Sentadilla
                'sets' => 3,
                'repetitions' => 15,
                'seconds_rest' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'routine_id' => 1,
                'exercise_id' => 3, // Peso muerto
                'sets' => 3,
                'repetitions' => 10,
                'seconds_rest' => 70,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'routine_id' => 1,
                'exercise_id' => 4, // Curl bíceps
                'sets' => 2,
                'repetitions' => 12,
                'seconds_rest' => 45,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'routine_id' => 1,
                'exercise_id' => 5, // Tríceps
                'sets' => 2,
                'repetitions' => 12,
                'seconds_rest' => 45,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            /*
            ============================
            RUTINA 2: HIPERTROFIA
            ============================
            */

            [
                'routine_id' => 2,
                'exercise_id' => 1, // Press banca
                'sets' => 4,
                'repetitions' => 8,
                'seconds_rest' => 90,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'routine_id' => 2,
                'exercise_id' => 2, // Sentadilla
                'sets' => 4,
                'repetitions' => 10,
                'seconds_rest' => 90,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'routine_id' => 2,
                'exercise_id' => 3, // Peso muerto
                'sets' => 4,
                'repetitions' => 8,
                'seconds_rest' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'routine_id' => 2,
                'exercise_id' => 4, // Bíceps
                'sets' => 3,
                'repetitions' => 10,
                'seconds_rest' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'routine_id' => 2,
                'exercise_id' => 5, // Tríceps
                'sets' => 3,
                'repetitions' => 10,
                'seconds_rest' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}

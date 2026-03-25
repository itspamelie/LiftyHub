<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExerciseFilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('exercise_files')->insert([
            [
                'exercise_id' => 1,
                'file_path' => 'press_banca.jpg',
                'type' => 'video',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'exercise_id' => 2,
                'file_path' => 'sentadilla.jpg',
                'type' => 'video',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

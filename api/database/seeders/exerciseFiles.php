<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class exerciseFiles extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('exercise_files')->insert([
    [
        'exercise_id' => 1,
        'file_path' => 'sentadilla1.jpg',
        'type' => 'image'
    ],
    [
        'exercise_id' => 1,
        'file_path' => 'sentadilla_video.mp4',
        'type' => 'video'
    ],
]);
    }
}

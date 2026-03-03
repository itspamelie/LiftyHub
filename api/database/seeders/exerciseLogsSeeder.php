<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class exerciseLogsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('exercise_logs')->insert([
    [
        'user_id' => 2,
        'exercise_id' => 1,
        'weight_lifted' => 40.00,
        'repetitions' => 12,
        'sets' => 4
    ],
]);
    }
}

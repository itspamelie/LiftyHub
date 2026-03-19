<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class userStreaksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
              DB::table('user_streaks')->insert([
    [
        'user_id' => 1,
        'current_streak' => 7,
        'longest_streak' => 15,
        'last_training_date' => '2026-03-17'
    ],
    [
        'user_id' => 2,
        'current_streak' => 5,
        'longest_streak' => 10,
        'last_training_date' => '2025-01-20'
    ],
]);
    }
}

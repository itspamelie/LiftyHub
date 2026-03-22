<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserStreaksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('user_streaks')->insert([
            [
                'user_id' => 3,
                'current_streak' => 3,
                'longest_streak' => 10,
                'last_training_date' => now()->subDay(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 4,
                'current_streak' => 1,
                'longest_streak' => 2,
                'last_training_date' => now()->subDays(3),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

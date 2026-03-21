<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
DB::table('user_schedule')->insert([
    // USER 3 (PRO)
    [
        'user_id'=>3,
        'routine_id'=>1,
        'user_routine_id'=>null,
        'day_of_week'=>'monday'
    ],
    [
        'user_id'=>3,
        'routine_id'=>2,
        'user_routine_id'=>null,
        'day_of_week'=>'wednesday'
    ],
    [
        'user_id'=>3,
        'routine_id'=>null,
        'user_routine_id'=>1,
        'day_of_week'=>'friday'
    ],
    [
        'user_id'=>3,
        'routine_id'=>1,
        'user_routine_id'=>null,
        'day_of_week'=>'tuesday'
    ],
]);
    }
}

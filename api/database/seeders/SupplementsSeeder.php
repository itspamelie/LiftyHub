<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class SupplementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     $planDays = DB::table('plan_days')->get();

foreach ($planDays as $day) {

    DB::table('supplements')->insert([
        [
            'plan_day_id' => $day->id,
            'name' => 'Proteína Whey',
            'amount' => '30g',
            'instructions' => 'Después de entrenar',
            'color' => '#FF5733',
            'order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'plan_day_id' => $day->id,
            'name' => 'Creatina',
            'amount' => '5g',
            'instructions' => 'Antes de entrenar',
            'color' => '#33C1FF',
            'order' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
}
    }
}

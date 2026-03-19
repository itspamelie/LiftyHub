<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class userPropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       DB::table('user_properties')->insert([
    [
        'user_id' => 1,
        'weight' => 80.00,
        'stature' => 175.00,
        'waist' => 85.00,
        'chest' => 100.00,
        'hips' => 95.00,
        'arms' => 35.00,
        'shoulders' => 110.00,
        'thighs' => 55.00,
        'objective' => 'Ganar músculo',
        'somatotype_id' => 1
    ],
    [
        'user_id' => 2,
        'weight' => 60.50,
        'stature' => 165.00,
        'waist' => 70.00,
        'chest' => 85.00,
        'hips' => 90.00,
        'arms' => 28.00,
        'shoulders' => 95.00,
        'thighs' => 50.00,
        'objective' => 'Bajar grasa',
        'somatotype_id' => 2
    ],
]);
    }
}

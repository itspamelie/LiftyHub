<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class UserPropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_properties')->insert([
            [
                'user_id' => 3, 
                'stature' => 1.70,
                'weight' => 70,
                'waist' => 80,
                'chest' => 95,
                'hips' => 90,
                'arms' => 30,
                'shoulders' => 110,
                'thighs' => 55,
                'objective' => 'Hipertrofia',
                'somatotype_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

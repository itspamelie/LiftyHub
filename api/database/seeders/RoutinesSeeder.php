<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoutinesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('routines')->insert([
            [
                'id' => 1,
                'name' => 'Full Body Principiante',
                'objective' => 'Adaptación',
                'level' => 'principiante',
                'duration' => 40,
                'category' => 'Todo',
                'img' => 'fullbody.png',
                'plan_id' => 1,
                'somatotype_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Hipertrofia Intermedia',
                'objective' => 'Ganar masa',
                'level' => 'intermedio',
                'duration' => 60,
                'category' => 'Fuerza',
                'img' => 'hipertrofia.png',
                'plan_id' => 2,
                'somatotype_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

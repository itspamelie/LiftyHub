<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class UserRoutinesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_routines')->insert([
            [
                'id' => 1,
                'user_id' => 3,
                'name' => 'Rutina personalizada gym',
                'category' => 'Hipertrofia',
                'objective' => 'Ganar masa',
                'level' => 'intermedio',
                'duration' => 60,
                'img' => 'custom1.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'user_id' => 4,
                'name' => 'Rutina básica casa',
                'category' => 'General',
                'objective' => 'Salud',
                'level' => 'principiante',
                'duration' => 30,
                'img' => 'custom2.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

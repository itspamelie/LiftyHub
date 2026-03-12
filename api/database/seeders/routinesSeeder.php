<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class routinesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
DB::table('routines')->insert([
    [
        'name' => 'Rutina Fuerza Básica',
        'objective' => 'Ganar músculo',
        'level' => 'Principiante',
        'img' => 'rutina1.jpg',
        'duration' => 60,
        'plan_id' => 1,
        'somatotype_id' => 2
    ],
]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class userRoutinesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('user_routines')->insert([
            [
                'user_id'   => 1,
                'name'      => 'Mi rutina de fuerza',
                'objective' => 'Ganar músculo',
                'level'     => 'Intermedio',
                'duration'  => 60,
                'img'       => null,
            ],
            [
                'user_id'   => 1,
                'name'      => 'Cardio matutino',
                'objective' => 'Bajar grasa',
                'level'     => 'Principiante',
                'duration'  => 30,
                'img'       => null,
            ],
            [
                'user_id'   => 1,
                'name'      => 'Rutina de piernas',
                'objective' => 'Ganar músculo',
                'level'     => 'Avanzado',
                'duration'  => 45,
                'img'       => null,
            ],
        ]);
    }
}

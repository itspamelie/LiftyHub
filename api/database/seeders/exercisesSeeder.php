<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class exercisesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    Exercise::insert([
    ['name'=>'Press banca','muscle'=>'Pecho','technique'=>'Empujar barra'],
    ['name'=>'Sentadilla','muscle'=>'Pierna','technique'=>'Flexión de rodillas'],
    ['name'=>'Peso muerto','muscle'=>'Espalda','technique'=>'Levantar barra'],
    ['name'=>'Curl bíceps','muscle'=>'Bíceps','technique'=>'Flexión de codo'],
    ['name'=>'Tríceps polea','muscle'=>'Tríceps','technique'=>'Extensión'],
    ['name'=>'Press militar','muscle'=>'Hombro','technique'=>'Empuje vertical'],
    ['name'=>'Abdominales','muscle'=>'Core','technique'=>'Flexión abdominal'],
]);
    }
}

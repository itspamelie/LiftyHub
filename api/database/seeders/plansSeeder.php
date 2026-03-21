<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class plansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       Plan::insert([
    [
        'name' => 'Free',
        'description' => 'Acceso básico',
        'price' => 0,
        'level' => 0,
        'max_routines' => 7
    ],
    [
        'name' => 'Básico',
        'description' => 'Rutinas intermedias',
        'price' => 99,
        'level' => 1,
        'max_routines' => 15
    ],
    [
        'name' => 'Pro',
        'description' => 'Rutinas avanzadas',
        'price' => 199,
        'level' => 2,
        'max_routines' => 30
    ],
    [
        'name' => 'Nutriólogo',
        'description' => 'Incluye dietas',
        'price' => 299,
        'level' => 3,
        'max_routines' => 50
    ]
]);
    }
}

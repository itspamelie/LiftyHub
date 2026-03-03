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
         DB::table('plans')->insert([
    [
        'name' => 'Plan Básico',
        'description' => 'Acceso a rutinas estándar',
        'price' => 199.00
    ],
    [
        'name' => 'Plan Premium',
        'description' => 'Incluye rutinas avanzadas + Dietas',
        'price' => 299.00
    ],
]);
    }
}

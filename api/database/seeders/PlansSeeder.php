<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('plans')->insert([
            [
                'id' => 1,
                'name' => 'Free',
                'description' => 'Acceso limitado',
                'price' => 0,
                'level' => 0,
                'max_routines' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Basic',
                'description' => 'Más rutinas y seguimiento',
                'price' => 99,
                'level' => 1,
                'max_routines' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Pro',
                'description' => 'Acceso completo + nutriólogo',
                'price' => 600,
                'level' => 3,
                'max_routines' => 999,
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'id' => 4,
                'name' => 'Meal',
                'description' => 'Solo dieta',
                'price' => 400,
                'level' => 2,
                'max_routines' => 999,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

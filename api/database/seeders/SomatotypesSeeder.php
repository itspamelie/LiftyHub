<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SomatotypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('somatotypes')->insert([
            ['type' => 'Ectomorfo', 'description' => 'Delgado', 'file' => 'ecto.png'],
            ['type' => 'Mesomorfo', 'description' => 'Atlético', 'file' => 'meso.png'],
            ['type' => 'Endomorfo', 'description' => 'Mayor grasa', 'file' => 'endo.png'],
        ]);
    }
}

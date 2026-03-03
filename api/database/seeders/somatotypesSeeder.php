<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class somatotypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          DB::table('somatotypes')->insert([
    ['type' => 'Ectomorfo', 'description' => 'Delgado, metabolismo rápido','file' => 'default.jpg'],
    ['type' => 'Mesomorfo', 'description' => 'Atlético, gana músculo fácilmente', 'file' => 'default.jpg'],
    ['type' => 'Endomorfo', 'description' => 'Mayor tendencia a almacenar grasa', 'file' => 'default.jpg'],
]);
    }
}

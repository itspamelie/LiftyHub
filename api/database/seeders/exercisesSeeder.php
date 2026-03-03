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
      DB::table('exercises')->insert([
    [
        'name' => 'Sentadilla',
        'muscle' => 'Piernas',
        'technique' => 'Espalda recta, bajar a 90 grados'
    ],
    [
        'name' => 'Press de banca',
        'muscle' => 'Pecho',
        'technique' => 'Bajar la barra controladamente'
    ],
]);
    }
}

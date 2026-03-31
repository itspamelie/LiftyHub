<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ExercisesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('exercises')->insert([
            ['id'=>1,'name'=>'Press banca','muscle'=>'Pecho','technique'=>'Controlar bajada','categorie'=>'tren superior','created_at'=>now(),'updated_at'=>now()],
            ['id'=>2,'name'=>'Sentadilla','muscle'=>'Piernas','technique'=>'Espalda recta','categorie'=>'tren superior','created_at'=>now(),'updated_at'=>now()],
            ['id'=>3,'name'=>'Peso muerto','muscle'=>'Espalda','technique'=>'No encorvar','categorie'=>'tren superior','created_at'=>now(),'updated_at'=>now()],
            ['id'=>4,'name'=>'Curl bíceps','muscle'=>'Bíceps','technique'=>'Movimiento controlado','categorie'=>'tren superior','created_at'=>now(),'updated_at'=>now()],
            ['id'=>5,'name'=>'Tríceps polea','muscle'=>'Tríceps','technique'=>'Codos fijos','categorie'=>'tren superior','created_at'=>now(),'updated_at'=>now()],
        ]);
    }
}

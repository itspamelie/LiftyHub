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
            ['id'=>1,'name'=>'Press banca','muscle'=>'Hombro','technique'=>'Controlar bajada','categorie'=>'Hipertrofia','created_at'=>now(),'updated_at'=>now()],
            ['id'=>2,'name'=>'Sentadilla','muscle'=>'Cuádriceps','technique'=>'Espalda recta','categorie'=>'Resistencia','created_at'=>now(),'updated_at'=>now()],
            ['id'=>3,'name'=>'Peso muerto','muscle'=>'Espalda','technique'=>'No encorvar','categorie'=>'Fuerza','created_at'=>now(),'updated_at'=>now()],
            ['id'=>4,'name'=>'Curl bíceps','muscle'=>'Bíceps','technique'=>'Movimiento controlado','categorie'=>'Hipertrofia','created_at'=>now(),'updated_at'=>now()],
            ['id'=>5,'name'=>'Tríceps polea','muscle'=>'Tríceps','technique'=>'Codos fijos','categorie'=>'tren superior','created_at'=>now(),'updated_at'=>now()],
        ]);
    }
}

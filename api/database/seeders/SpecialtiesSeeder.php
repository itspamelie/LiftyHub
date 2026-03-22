<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class SpecialtiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('specialties')->insert([
            ['id'=>1,'name'=>'Pérdida de grasa','created_at'=>now(),'updated_at'=>now()],
            ['id'=>2,'name'=>'Hipertrofia','created_at'=>now(),'updated_at'=>now()],
            ['id'=>3,'name'=>'Nutrición deportiva','created_at'=>now(),'updated_at'=>now()],
            ['id'=>4,'name'=>'Recomposición corporal','created_at'=>now(),'updated_at'=>now()],
        ]);
    }
}

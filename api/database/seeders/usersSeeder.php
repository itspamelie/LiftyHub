<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class usersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
DB::table('users')->insert([
    [
        'name' => 'Admin Principal',
        'email' => 'admin@app.com',
        'password' => Hash::make('password'),
        'gender' => 'Femenino',
        'img' => 'admin.jpg',
        'birthdate' => '1995-05-10',
        'role' => 'admin',
    ],
    [
        'name' => 'Ana López',
        'email' => 'ana@app.com',
        'password' => Hash::make('password'),
        'gender' => 'Femenino',
        'img' => 'ana.jpg',
        'birthdate' => '2000-03-15',
        'role' => 'user',
    ],
    [
        'name' => 'Carlos Méndez',
        'email' => 'carlos@app.com',
        'password' => Hash::make('password'),
        'gender' => 'Masculino',
        'img' => 'carlos.jpg',
        'birthdate' => '1998-08-20',
        'role' => 'user',
    ],
    [
        'name' => 'Dra. Laura Pérez',
        'email' => 'nutri@app.com',
        'password' => Hash::make('password'),
        'gender' => 'Femenino',
        'img' => 'nutri.jpg',
        'birthdate' => '1990-01-01',
        'role' => 'nutritionist',
    ],
]);
    }
}

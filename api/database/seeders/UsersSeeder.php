<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
           DB::table('users')->insert([
            [
                'id' => 1,
                'name' => 'Admin LiftyHub',
                'email' => 'admin@app.com',
                'password' => Hash::make('password'),
                'gender' => 'masculino',
                'img' => 'default.jpg',
                'birthdate' => '1995-05-10',
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Nutrióloga Ana',
                'email' => 'nutri@liftyhub.com',
                'password' => Hash::make('123456'),
                'gender' => 'femenino',
                'img' => 'default.jpg',
                'birthdate' => '1990-03-20',
                'role' => 'nutritionist',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Juan Pérez',
                'email' => 'juan@test.com',
                'password' => Hash::make('123456'),
                'gender' => 'masculino',
                'img' => 'default.jpg',
                'birthdate' => '2000-07-15',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'María López',
                'email' => 'maria@test.com',
                'password' => Hash::make('123456'),
                'gender' => 'Femenino',
                'img' => 'default.jpg',
                'birthdate' => '2001-02-10',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'id' => 5,
                'name' => 'Panchita López',
                'email' => 'panchita@test.com',
                'password' => Hash::make('123456'),
                'gender' => 'Femenino',
                'img' => 'default.jpg',
                'birthdate' => '2001-02-10',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'id' => 6,
                'name' => 'juanita López',
                'email' => 'juanita@test.com',
                'password' => Hash::make('123456'),
                'gender' => 'Femenino',
                'img' => 'default.jpg',
                'birthdate' => '2001-02-10',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

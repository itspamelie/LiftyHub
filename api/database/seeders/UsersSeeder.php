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
                'email' => 'admin@liftyhub.com',
                'password' => Hash::make('123456'),
                'gender' => 'female',
                'img' => 'admin.png',
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
                'gender' => 'female',
                'img' => 'nutri.png',
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
                'gender' => 'male',
                'img' => 'user1.png',
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
                'gender' => 'female',
                'img' => 'user2.png',
                'birthdate' => '2001-02-10',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

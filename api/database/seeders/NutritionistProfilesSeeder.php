<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class NutritionistProfilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('nutritionist_profiles')->insert([
            [
                'user_id' => 2,
                'license_number' => 'NUT-12345',
                'profile_pic' => 'nutri.png',
                'specialty' => 'Nutrición deportiva',
                'location' => 'México',
                'bio' => 'Especialista en recomposición corporal',
                'rating' => 4.5,
                'reviews_count' => 10,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

    }

    
}

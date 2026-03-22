<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NutritionProfilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('nutrition_profiles')->insert([
    [
        'user_id' => 3,
        'weight' => 75.50,
        'age' => 24,
        'height' => 175.00,
        'meal_schedule' => '8:00am, 11:00am, 2:00pm, 5:00pm, 8:00pm',
        'favorite_foods' => 'pollo, arroz, pasta',
        'disliked_foods' => 'brócoli',
        'allergies' => 'ninguna',
        'medical_restrictions' => 'ninguna',
        'favorite_meal' => 'pizza',
        'can_cook_sunday' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'user_id' => 4,
        'weight' => 60.00,
        'age' => 23,
        'height' => 165.00,
        'meal_schedule' => '7:00am, 10:00am, 1:00pm, 4:00pm, 7:00pm',
        'favorite_foods' => 'ensaladas, pollo',
        'disliked_foods' => 'comida chatarra',
        'allergies' => 'lactosa',
        'medical_restrictions' => 'evitar azúcar',
        'favorite_meal' => 'tacos',
        'can_cook_sunday' => false,
        'created_at' => now(),
        'updated_at' => now(),
    ],
]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class nutritionistProfiles extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('nutritionist_profiles')->insert([
    [
        'user_id' => 4,
        'license_number' => 'NUTR-12345',
        'profile_pic' => 'nutri_profile.jpg',
        'bio' => 'Nutrióloga especializada en recomposición corporal'
    ],
]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
     $this->call([
    somatotypesSeeder::class,
    usersSeeder::class,
    plansSeeder::class,
    routinesSeeder::class,
    exercisesSeeder::class,
    exerciseFiles::class,
    exerciseRoutinesSeeder::class,
    suscriptionsSeeder::class,
    userPropertiesSeeder::class,
    paymentDetailsSeeder::class,
    monthlyProgressSeeder::class,
    exerciseLogsSeeder::class,
    userStreaksSeeder::class,
    nutritionistProfiles::class,
]);
    }
}

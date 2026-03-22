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
        UsersSeeder::class,
        NutritionProfilesSeeder::class,
        SomatotypesSeeder::class,
        PlansSeeder::class,

        UserPropertiesSeeder::class,
        PaymentDetailsSeeder::class,
        MonthlyProgressSeeder::class,

        SubscriptionSeeder::class,

        ExercisesSeeder::class,
        ExerciseFilesSeeder::class,

        RoutinesSeeder::class,
        ExerciseRoutinesSeeder::class,

        UserRoutinesSeeder::class,
        UserRoutineExercisesSeeder::class,

        UserSavedRoutinesSeeder::class,
        UserScheduleSeeder::class,
        UserRoutineSessionsSeeder::class,

        ExerciseLogsSeeder::class,
        UserStreaksSeeder::class,

        NutritionistProfilesSeeder::class,
        NutritionistExperiencesSeeder::class,
        NutritionistEducationsSeeder::class,

        SpecialtiesSeeder::class,
        NutritionistSpecialtiesSeeder::class,
        NutritionistReviewsSeeder::class,

        DietPlansSeeder::class,
        PlanDaysSeeder::class,
        MealsSeeder::class,
        SupplementsSeeder::class,
        RecommendationsSeeder::class,
        DietReviewsSeeder::class,
    ]);
}
    }


<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          DB::table('subscriptions')->insert([
            [
                'user_id' => 3,
                'plan_id' => 3, // plan PRO
                'start_date' => now(),
                'end_date' => now()->addMonth(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 4, 
                'plan_id' => 1, // plan gratuito
                'start_date' => now(),
                'end_date' => now()->addMonth(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],[
                'user_id' => 6,
                'plan_id' => 2, // plan basic
                'start_date' => now(),
                'end_date' => now()->addMonth(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],[
                'user_id' => 5,
                'plan_id' => 4, // plan meal solo dieta
                'start_date' => now(),
                'end_date' => now()->addMonth(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }

}

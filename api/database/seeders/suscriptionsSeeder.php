<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class suscriptionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
DB::table('subscriptions')->insert([
    [
        'user_id' => 2,
        'plan_id' => 1,
        'start_date' => '2025-01-01',
        'end_date' => '2025-12-31',
        'status' => 'active'
    ],
]);
    }
}

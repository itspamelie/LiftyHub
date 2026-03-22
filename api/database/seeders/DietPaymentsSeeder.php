<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DietPaymentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('diet_payments')->insert([
    [
        'diet_request_id' => 1,
        'amount' => 500.00,
        'status' => 'paid',
        'payment_method' => 'card',
        'created_at' => now(),
        'updated_at' => now(),
    ],
]);
    }
}

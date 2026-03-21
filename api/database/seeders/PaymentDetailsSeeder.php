<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('payment_details')->insert([
            [
                'user_id' => 3,
                'name' => 'Juan',
                'bank' => 'BBVA',
                'card_number' => '4111111111111111',
                'expiration_date' => '2028-12-01',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

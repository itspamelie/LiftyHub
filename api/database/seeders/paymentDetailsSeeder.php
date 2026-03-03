<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;



class paymentDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     DB::table('payment_details')->insert([
    [
        'user_id' => 2,
        'name' => 'Ana López',
        'bank' => 'BBVA',
        'card_number' => '4111111111111111',
        'expiration_date' => '2027-12-01'
    ],
]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@financialhealth.com'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'phone' => '+62 811-0000-9999',
                'goal' => 'Corporate Financial Health Governance',
                'annual_target' => 1000000000,
                'monthly_target' => 50000000,
            ]
        );
    }
}

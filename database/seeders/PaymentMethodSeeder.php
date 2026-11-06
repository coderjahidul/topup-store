<?php

namespace Database\Seeders;

use App\Enums\AccountType;
use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Seed manual payment methods for Bangladesh.
     */
    public function run(): void
    {
        $methods = [
            [
                'name' => 'bKash',
                'code' => 'bkash',
                'account_number' => '01XXXXXXXXX',
                'account_type' => AccountType::Personal,
                'instruction' => [
                    'bn' => 'bKash Personal নম্বরে Send Money করে TrxID দিন।',
                    'en' => 'Send Money to the bKash Personal number and submit the TrxID.',
                ],
                'sort_order' => 1,
            ],
            [
                'name' => 'Nagad',
                'code' => 'nagad',
                'account_number' => '01XXXXXXXXX',
                'account_type' => AccountType::Personal,
                'instruction' => [
                    'bn' => 'Nagad Personal নম্বরে Send Money করে TrxID দিন।',
                    'en' => 'Send Money to the Nagad Personal number and submit the TrxID.',
                ],
                'sort_order' => 2,
            ],
            [
                'name' => 'Rocket',
                'code' => 'rocket',
                'account_number' => '01XXXXXXXXX',
                'account_type' => AccountType::Personal,
                'instruction' => [
                    'bn' => 'Rocket Personal নম্বরে Send Money করে TrxID দিন।',
                    'en' => 'Send Money to the Rocket Personal number and submit the TrxID.',
                ],
                'sort_order' => 3,
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::query()->updateOrCreate(
                ['code' => $method['code']],
                [
                    ...$method,
                    'min_amount' => 10,
                    'max_amount' => 50000,
                    'charge_percent' => 0,
                    'is_active' => true,
                    'logo' => null,
                ],
            );
        }
    }
}

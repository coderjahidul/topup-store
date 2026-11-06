<?php

namespace Database\Factories;

use App\Enums\AccountType;
use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PaymentMethod>
 */
class PaymentMethodFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement(['bKash', 'Nagad', 'Rocket']);

        return [
            'name' => $name,
            'code' => Str::slug($name).'-'.fake()->unique()->numerify('##'),
            'account_number' => '01'.fake()->numerify('#########'),
            'account_type' => AccountType::Personal,
            'instruction' => [
                'bn' => $name.' এ সেন্ড মানি করে TrxID দিন।',
                'en' => 'Send money via '.$name.' and submit the TrxID.',
            ],
            'logo' => null,
            'min_amount' => 10,
            'max_amount' => 50000,
            'charge_percent' => 0,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}

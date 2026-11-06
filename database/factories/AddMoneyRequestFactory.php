<?php

namespace Database\Factories;

use App\Enums\AddMoneyStatus;
use App\Models\AddMoneyRequest;
use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AddMoneyRequest>
 */
class AddMoneyRequestFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'payment_method_id' => PaymentMethod::factory(),
            'amount' => fake()->randomElement([100, 200, 500, 1000]),
            'sender_number' => '01'.fake()->numerify('#########'),
            'trx_id' => strtoupper(fake()->unique()->bothify('AM########')),
            'status' => AddMoneyStatus::Pending,
            'admin_id' => null,
            'admin_note' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AddMoneyStatus::Approved,
            'admin_id' => User::factory(),
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Enums\CouponType;
use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('SAVE##??')),
            'type' => CouponType::Percent,
            'value' => 10,
            'min_order_amount' => 100,
            'max_discount' => 50,
            'usage_limit' => 100,
            'used_count' => 0,
            'per_user_limit' => 1,
            'starts_at' => now()->subDay(),
            'expires_at' => now()->addMonth(),
            'applicable_game_id' => null,
            'first_order_only' => false,
            'is_active' => true,
        ];
    }

    public function fixed(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => CouponType::Fixed,
            'value' => 20,
            'max_discount' => null,
        ]);
    }
}

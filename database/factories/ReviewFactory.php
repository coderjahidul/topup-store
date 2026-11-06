<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory()->completed(),
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'rating' => fake()->numberBetween(4, 5),
            'comment' => fake()->sentence(),
            'is_approved' => true,
        ];
    }
}

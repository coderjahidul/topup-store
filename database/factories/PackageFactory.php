<?php

namespace Database\Factories;

use App\Models\Game;
use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Package>
 */
class PackageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->randomElement([50, 100, 200, 500, 1000, 2000]);

        return [
            'game_id' => Game::factory(),
            'name' => [
                'bn' => $price.' ডায়মন্ড',
                'en' => $price.' Diamonds',
            ],
            'price' => $price,
            'discount_price' => null,
            'reseller_price' => $price * 0.95,
            'cost_price' => $price * 0.85,
            'stock' => null,
            'supplier_code' => null,
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 50),
        ];
    }

    public function discounted(): static
    {
        return $this->state(function (array $attributes) {
            $price = (float) $attributes['price'];

            return [
                'discount_price' => round($price * 0.9, 2),
            ];
        });
    }
}

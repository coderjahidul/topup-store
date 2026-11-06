<?php

namespace Database\Factories;

use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Game>
 */
class GameFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nameEn = fake()->unique()->words(2, true);

        return [
            'name' => [
                'bn' => $nameEn.' (গেম)',
                'en' => $nameEn,
            ],
            'slug' => Str::slug($nameEn).'-'.fake()->unique()->numerify('###'),
            'image' => null,
            'banner' => null,
            'description' => [
                'bn' => 'এই গেমের জন্য দ্রুত টপ-আপ করুন।',
                'en' => 'Top up this game quickly and safely.',
            ],
            'uid_label' => [
                'bn' => 'প্লেয়ার UID',
                'en' => 'Player UID',
            ],
            'requires_server' => false,
            'servers' => null,
            'sort_order' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function withServers(): static
    {
        return $this->state(fn (array $attributes) => [
            'requires_server' => true,
            'servers' => ['Asia', 'Europe', 'America'],
        ]);
    }
}

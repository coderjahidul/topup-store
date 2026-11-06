<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'code' => Str::slug($name).'-'.fake()->unique()->numerify('##'),
            'driver' => 'App\\Suppliers\\ManualSupplier',
            'credentials' => [
                'api_key' => 'demo-key',
                'api_secret' => 'demo-secret',
            ],
            'balance_cache' => 0,
            'is_active' => true,
        ];
    }
}

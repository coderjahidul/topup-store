<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Supplier;
use App\Models\SupplierLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SupplierLog>
 */
class SupplierLogFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'supplier_id' => Supplier::factory(),
            'request' => ['action' => 'placeOrder'],
            'response' => ['ok' => true],
            'status' => 'success',
        ];
    }
}

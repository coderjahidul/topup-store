<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Seed the default manual supplier.
     */
    public function run(): void
    {
        Supplier::query()->updateOrCreate(
            ['code' => 'manual'],
            [
                'name' => 'Manual Top-up',
                'driver' => 'App\\Suppliers\\ManualSupplier',
                'credentials' => [],
                'balance_cache' => 0,
                'is_active' => true,
            ],
        );
    }
}

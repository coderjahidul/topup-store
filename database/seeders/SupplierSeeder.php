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

        Supplier::query()->updateOrCreate(
            ['code' => 'sample_api'],
            [
                'name' => 'Sample API Supplier',
                'driver' => 'App\\Suppliers\\SampleApiSupplier',
                'credentials' => [
                    'api_key' => 'demo-key',
                    'api_secret' => 'demo-secret',
                    'demo_balance' => 50000,
                    'force_fail' => false,
                    'fail_rate' => 0,
                ],
                'balance_cache' => 50000,
                'is_active' => false,
            ],
        );
    }
}

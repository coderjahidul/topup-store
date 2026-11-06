<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use App\Suppliers\ManualSupplier;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminSupplierTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        return $admin;
    }

    public function test_admin_can_list_and_create_supplier(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->get(route('admin.suppliers.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Suppliers/Index'));

        $this->actingAs($admin)
            ->post(route('admin.suppliers.store'), [
                'name' => 'Partner API',
                'code' => 'partner_api',
                'driver' => ManualSupplier::class,
                'credentials_json' => '{"api_key":"secret"}',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.suppliers.index'));

        $supplier = Supplier::query()->where('code', 'partner_api')->first();
        $this->assertNotNull($supplier);
        $this->assertSame('secret', $supplier->credentials['api_key']);
    }

    public function test_admin_can_sync_balance(): void
    {
        $admin = $this->admin();
        $supplier = Supplier::factory()->create([
            'driver' => ManualSupplier::class,
            'balance_cache' => 42,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.suppliers.sync-balance', $supplier))
            ->assertRedirect();

        $this->assertSame('42.00', $supplier->fresh()->balance_cache);
    }
}

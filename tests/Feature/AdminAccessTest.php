<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $customer = User::factory()->create();
        $customer->assignRole('customer');

        $this->actingAs($customer)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_admin_can_view_dashboard(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->has('stats')
            );
    }

    public function test_super_admin_can_access_admin_when_permission_cache_is_empty(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $admin = User::query()->where('email', 'admin@example.com')->firstOrFail();

        Cache::put(config('permission.cache.key'), [
            'alias' => [],
            'permissions' => [],
            'roles' => [],
        ]);
        app(PermissionRegistrar::class)->clearPermissionsCollection();

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertOk();
    }

    public function test_admin_login_redirects_to_admin_dashboard(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $this->post(route('login'), [
            'email' => 'admin@example.com',
            'password' => 'password',
        ])->assertRedirect(route('admin.dashboard'));
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('admin.dashboard'))
            ->assertRedirect(route('login'));
    }
}

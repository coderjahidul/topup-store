<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminReportTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        return $admin;
    }

    public function test_admin_can_view_reports(): void
    {
        $admin = $this->admin();
        Order::factory()->count(2)->create();

        $this->actingAs($admin)
            ->get(route('admin.reports.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Reports/Index')
                ->has('report.sales')
                ->has('report.by_game')
            );
    }

    public function test_admin_can_export_sales_excel(): void
    {
        $admin = $this->admin();
        Order::factory()->create();

        $this->actingAs($admin)
            ->get(route('admin.reports.sales.excel'))
            ->assertOk();
    }

    public function test_support_cannot_view_reports(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        $support = User::factory()->create();
        $support->assignRole('support');

        $this->actingAs($support)
            ->get(route('admin.reports.index'))
            ->assertForbidden();
    }
}

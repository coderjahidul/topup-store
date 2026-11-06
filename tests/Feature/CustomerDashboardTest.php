<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CustomerDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_shows_balance_orders_and_referral(): void
    {
        Role::findOrCreate('customer', 'web');
        $user = User::factory()->withBalance(350)->create([
            'referral_code' => 'HELLO123',
        ]);
        $user->assignRole('customer');

        Order::factory()->for($user)->count(2)->create();
        WalletTransaction::factory()->for($user)->create(['amount' => 100]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customer/Dashboard')
                ->where('stats.balance', '350.00')
                ->where('stats.referral_code', 'HELLO123')
                ->has('recentOrders', 2)
                ->has('recentTransactions', 1)
            );
    }

    public function test_guest_cannot_access_dashboard(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }
}

<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Order;
use App\Models\Package;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CustomerOrderHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_own_orders_and_reorder(): void
    {
        $user = User::factory()->create();
        $game = Game::factory()->create(['slug' => 'free-fire', 'is_active' => true]);
        $package = Package::factory()->for($game)->create(['is_active' => true]);
        $order = Order::factory()->for($user)->forPackage($package)->create([
            'player_uid' => '5556667778',
        ]);

        $this->actingAs($user)
            ->get(route('customer.orders.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customer/Orders')
                ->has('orders.data', 1)
            );

        $this->actingAs($user)
            ->post(route('customer.orders.reorder', $order))
            ->assertRedirect(route('games.show', [
                'game' => 'free-fire',
                'package' => $package->id,
                'uid' => '5556667778',
                'server' => $order->server,
            ]));
    }

    public function test_user_cannot_view_another_users_order(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $order = Order::factory()->for($owner)->create();

        $this->actingAs($other)
            ->get(route('customer.orders.show', $order))
            ->assertForbidden();
    }
}

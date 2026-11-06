<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Package;
use App\Models\PaymentMethod;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StorefrontGamePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_game_page_shows_active_packages_and_payment_methods(): void
    {
        $game = Game::factory()->create(['slug' => 'free-fire', 'is_active' => true]);
        Package::factory()->for($game)->count(2)->create(['is_active' => true]);
        PaymentMethod::factory()->create(['code' => 'bkash', 'is_active' => true]);

        $this->get(route('games.show', $game))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Games/Show')
                ->where('game.slug', 'free-fire')
                ->has('game.packages', 2)
                ->has('paymentMethods')
            );
    }

    public function test_inactive_game_returns_not_found(): void
    {
        $game = Game::factory()->inactive()->create(['slug' => 'hidden-game']);

        $this->get(route('games.show', $game))->assertNotFound();
    }

    public function test_checkout_preview_validates_guest_payload(): void
    {
        $game = Game::factory()->create(['is_active' => true, 'requires_server' => false]);
        $package = Package::factory()->for($game)->create(['is_active' => true]);
        PaymentMethod::factory()->create(['code' => 'bkash', 'is_active' => true]);

        $this->from(route('games.show', $game))
            ->post(route('games.checkout-preview', $game), [
                'package_id' => $package->id,
                'player_uid' => '123456789',
                'payment_method' => 'bkash',
                'guest_name' => 'Karim',
                'guest_phone' => '01712345678',
                'sender_number' => '01812345678',
                'trx_id' => 'abc12345',
                'idempotency_token' => 'token-1',
            ])
            ->assertRedirect(route('games.show', $game))
            ->assertSessionHas('success');
    }

    public function test_checkout_preview_requires_bd_phone_for_guests(): void
    {
        $game = Game::factory()->create(['is_active' => true]);
        $package = Package::factory()->for($game)->create(['is_active' => true]);

        $this->from(route('games.show', $game))
            ->post(route('games.checkout-preview', $game), [
                'package_id' => $package->id,
                'player_uid' => '123456789',
                'payment_method' => 'bkash',
                'guest_name' => 'Karim',
                'guest_phone' => '12345',
                'sender_number' => '01812345678',
                'trx_id' => 'ABC12345',
                'idempotency_token' => 'token-2',
            ])
            ->assertSessionHasErrors('guest_phone');
    }
}

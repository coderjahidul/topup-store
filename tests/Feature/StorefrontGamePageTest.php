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
                ->where('checkoutEnabled', true)
            );
    }

    public function test_inactive_game_returns_not_found(): void
    {
        $game = Game::factory()->inactive()->create(['slug' => 'hidden-game']);

        $this->get(route('games.show', $game))->assertNotFound();
    }
}

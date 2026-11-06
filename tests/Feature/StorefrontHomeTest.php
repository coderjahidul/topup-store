<?php

namespace Tests\Feature;

use App\Models\Banner;
use App\Models\Game;
use App\Models\Notice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StorefrontHomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_storefront_props(): void
    {
        $this->seed();

        Game::factory()->create(['is_active' => true]);
        Banner::factory()->create(['is_active' => true]);
        Notice::factory()->create(['is_active' => true]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('games')
                ->has('banners')
                ->has('notices')
                ->has('popularPackages')
                ->has('recentOrders')
                ->has('reviews')
                ->has('flashSaleEndsAt')
            );
    }
}

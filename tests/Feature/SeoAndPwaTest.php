<?php

namespace Tests\Feature;

use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoAndPwaTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_lists_home_and_games(): void
    {
        Game::factory()->create(['slug' => 'free-fire', 'is_active' => true]);

        $response = $this->get(route('sitemap'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml');
        $response->assertSee('free-fire', false);
        $response->assertSee('hreflang="bn"', false);
    }

    public function test_web_manifest_is_available(): void
    {
        $this->get(route('manifest'))
            ->assertOk()
            ->assertJsonPath('display', 'standalone')
            ->assertJsonStructure(['name', 'icons', 'theme_color']);
    }

    public function test_security_headers_are_present(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('X-Content-Type-Options', 'nosniff');
    }
}

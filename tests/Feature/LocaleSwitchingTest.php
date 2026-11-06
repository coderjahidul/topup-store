<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LocaleSwitchingTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_shares_bangla_translations_by_default(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->where('locale', 'bn')
            ->has('translations')
            ->where('translations', function ($translations) {
                $translations = collect($translations);

                return $translations->get('nav.home') === 'হোম';
            })
        );
    }

    public function test_guest_can_switch_locale_via_session(): void
    {
        $response = $this->from(route('home'))
            ->post(route('locale.update'), ['locale' => 'en']);

        $response->assertRedirect(route('home'));
        $this->assertEquals('en', session('locale'));

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('locale', 'en')
                ->where('translations', function ($translations) {
                    $translations = collect($translations);

                    return $translations->get('nav.home') === 'Home';
                })
            );
    }

    public function test_authenticated_user_locale_is_persisted(): void
    {
        $user = User::factory()->create(['locale' => 'bn']);

        $this->actingAs($user)
            ->from(route('dashboard'))
            ->post(route('locale.update'), ['locale' => 'en'])
            ->assertRedirect(route('dashboard'));

        $this->assertEquals('en', $user->fresh()->locale);
        $this->assertEquals('en', session('locale'));
    }

    public function test_invalid_locale_is_rejected(): void
    {
        $this->from(route('home'))
            ->post(route('locale.update'), ['locale' => 'fr'])
            ->assertSessionHasErrors('locale');
    }
}

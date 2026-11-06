<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_registration_screen_accepts_referral_query(): void
    {
        $this->get('/register?ref=HELLO123')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/Register')
                ->where('referralCode', 'HELLO123')
            );
    }

    public function test_new_users_can_register(): void
    {
        Role::findOrCreate('customer', 'web');

        $response = $this->post('/register', [
            'name' => 'Test User',
            'phone' => '01712345678',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_new_users_can_register_with_referral_code(): void
    {
        Role::findOrCreate('customer', 'web');
        $referrer = User::factory()->create(['referral_code' => 'REFCODE1']);

        $response = $this->post('/register', [
            'name' => 'Referred User',
            'phone' => '01812345678',
            'email' => 'referred@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'referral_code' => 'REFCODE1',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'phone' => '01812345678',
            'referred_by' => $referrer->id,
        ]);
    }
}

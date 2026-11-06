<?php

namespace Tests\Feature;

use App\Enums\TransactionSource;
use App\Enums\UserStatus;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserBalanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_adjust_balance_and_block_user(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $user = User::factory()->withBalance(50)->create();

        $this->actingAs($admin)
            ->post(route('admin.users.adjust-balance', $user), [
                'amount' => 25,
                'type' => 'credit',
                'note' => 'Promo credit',
            ])
            ->assertRedirect();

        $this->assertSame('75.00', $user->fresh()->balance);
        $this->assertDatabaseHas('wallet_transactions', [
            'user_id' => $user->id,
            'source' => TransactionSource::AdminAdjust->value,
            'amount' => '25.00',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.users.block', $user))
            ->assertRedirect();

        $this->assertSame(UserStatus::Blocked, $user->fresh()->status);
    }
}

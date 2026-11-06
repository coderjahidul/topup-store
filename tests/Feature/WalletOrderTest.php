<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\TransactionType;
use App\Exceptions\InsufficientBalanceException;
use App\Models\Game;
use App\Models\Order;
use App\Models\Package;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_registered_user_can_pay_with_wallet(): void
    {
        $user = User::factory()->withBalance(500)->create();
        $game = Game::factory()->create(['is_active' => true]);
        $package = Package::factory()->for($game)->create([
            'is_active' => true,
            'price' => 200,
            'discount_price' => null,
        ]);

        $this->actingAs($user)
            ->post(route('orders.store', $game), [
                'package_id' => $package->id,
                'player_uid' => '9988776655',
                'payment_method' => 'wallet',
                'idempotency_token' => 'wallet-token-1',
            ])
            ->assertRedirect();

        $order = Order::query()->first();
        $user->refresh();

        $this->assertSame(OrderStatus::Processing, $order->status);
        $this->assertSame(PaymentStatus::Paid, $order->payment_status);
        $this->assertSame('300.00', $user->balance);
        $this->assertSame('9988776655', $user->last_player_uid);
        $this->assertDatabaseHas('wallet_transactions', [
            'user_id' => $user->id,
            'type' => TransactionType::Debit->value,
            'amount' => '200.00',
        ]);
    }

    public function test_insufficient_balance_is_rejected(): void
    {
        $user = User::factory()->withBalance(50)->create();
        $game = Game::factory()->create(['is_active' => true]);
        $package = Package::factory()->for($game)->create([
            'is_active' => true,
            'price' => 200,
        ]);

        $this->actingAs($user)
            ->from(route('games.show', $game))
            ->post(route('orders.store', $game), [
                'package_id' => $package->id,
                'player_uid' => '1122334455',
                'payment_method' => 'wallet',
                'idempotency_token' => 'wallet-token-2',
            ])
            ->assertRedirect(route('games.show', $game))
            ->assertSessionHas('error');

        $this->assertSame(0, Order::query()->count());
        $this->assertSame('50.00', $user->fresh()->balance);
    }

    public function test_concurrent_wallet_debit_does_not_overdraw(): void
    {
        $user = User::factory()->withBalance(100)->create();
        $game = Game::factory()->create(['is_active' => true]);
        $package = Package::factory()->for($game)->create([
            'is_active' => true,
            'price' => 100,
            'discount_price' => null,
        ]);

        /** @var OrderService $orders */
        $orders = app(OrderService::class);

        $first = $orders->create($game, [
            'package_id' => $package->id,
            'player_uid' => '1000000001',
            'payment_method' => 'wallet',
            'idempotency_token' => 'concurrent-1',
        ], $user);

        $this->assertSame(OrderStatus::Processing, $first->status);

        try {
            $orders->create($game, [
                'package_id' => $package->id,
                'player_uid' => '1000000002',
                'payment_method' => 'wallet',
                'idempotency_token' => 'concurrent-2',
            ], $user->fresh());
            $this->fail('Expected InsufficientBalanceException');
        } catch (InsufficientBalanceException) {
            // expected
        }

        $this->assertSame(1, Order::query()->count());
        $this->assertSame('0.00', $user->fresh()->balance);
        $this->assertSame(1, WalletTransaction::query()->where('type', TransactionType::Debit)->count());
    }
}

<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethodCode;
use App\Enums\PaymentStatus;
use App\Enums\TransactionSource;
use App\Models\Game;
use App\Models\Order;
use App\Models\Package;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderRefundTest extends TestCase
{
    use RefreshDatabase;

    public function test_failing_paid_wallet_order_refunds_once(): void
    {
        $user = User::factory()->withBalance(0)->create();
        $order = Order::factory()->for($user)->create([
            'payment_method' => PaymentMethodCode::Wallet,
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Processing,
            'amount' => 150,
            'final_amount' => 150,
            'trx_id' => null,
        ]);
        $order->forceFill([
            'amount' => 150,
            'final_amount' => 150,
            'payment_method' => PaymentMethodCode::Wallet,
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Processing,
        ])->saveQuietly();

        /** @var OrderService $orders */
        $orders = app(OrderService::class);
        $orders->failAndRefund($order, 'Supplier failed');
        $orders->failAndRefund($order->fresh(), 'Supplier failed again');

        $this->assertSame(OrderStatus::Refunded, $order->fresh()->status);
        $this->assertSame(PaymentStatus::Refunded, $order->fresh()->payment_status);
        $this->assertSame('150.00', $user->fresh()->balance);
        $this->assertDatabaseCount('wallet_transactions', 1);
        $this->assertDatabaseHas('wallet_transactions', [
            'user_id' => $user->id,
            'source' => TransactionSource::Refund->value,
            'amount' => '150.00',
        ]);
    }

    public function test_duplicate_trx_id_cannot_be_reused_on_new_order(): void
    {
        $game = Game::factory()->create(['is_active' => true]);
        $package = Package::factory()->for($game)->create(['is_active' => true, 'price' => 80]);
        PaymentMethod::factory()->create(['code' => 'bkash', 'is_active' => true]);

        Order::factory()->create([
            'game_id' => $game->id,
            'package_id' => $package->id,
            'trx_id' => 'DUPORDER1',
        ]);

        $this->from(route('games.show', $game))
            ->post(route('orders.store', $game), [
                'package_id' => $package->id,
                'player_uid' => '7777777777',
                'payment_method' => 'bkash',
                'guest_name' => 'Dup',
                'guest_phone' => '01722223333',
                'sender_number' => '01822223333',
                'trx_id' => 'duporder1',
                'idempotency_token' => 'dup-token',
            ])
            ->assertSessionHasErrors('trx_id');
    }
}

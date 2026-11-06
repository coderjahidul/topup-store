<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Game;
use App\Models\Order;
use App\Models\Package;
use App\Models\PaymentMethod;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_place_manual_payment_order(): void
    {
        $game = Game::factory()->create(['is_active' => true, 'requires_server' => false]);
        $package = Package::factory()->for($game)->create([
            'is_active' => true,
            'price' => 100,
            'discount_price' => 90,
        ]);
        PaymentMethod::factory()->create(['code' => 'bkash', 'is_active' => true]);

        $response = $this->post(route('orders.store', $game), [
            'package_id' => $package->id,
            'player_uid' => '1234567890',
            'payment_method' => 'bkash',
            'guest_name' => 'Karim Guest',
            'guest_phone' => '01712345678',
            'sender_number' => '01812345678',
            'trx_id' => 'trxguest001',
            'idempotency_token' => 'guest-token-1',
        ]);

        $order = Order::query()->first();

        $this->assertNotNull($order);
        $response->assertRedirect(route('orders.track.show', [
            'order_number' => $order->order_number,
            'phone' => '01712345678',
        ]));

        $this->assertSame(OrderStatus::Pending, $order->status);
        $this->assertSame(PaymentStatus::Pending, $order->payment_status);
        $this->assertNull($order->user_id);
        $this->assertSame('90.00', $order->final_amount);
        $this->assertSame('TRXGUEST001', $order->trx_id);
    }

    public function test_duplicate_idempotency_token_returns_same_order(): void
    {
        $game = Game::factory()->create(['is_active' => true]);
        $package = Package::factory()->for($game)->create(['is_active' => true, 'price' => 50]);
        PaymentMethod::factory()->create(['code' => 'nagad', 'is_active' => true]);

        $payload = [
            'package_id' => $package->id,
            'player_uid' => '5555555555',
            'payment_method' => 'nagad',
            'guest_name' => 'Same Token',
            'guest_phone' => '01912345678',
            'sender_number' => '01612345678',
            'trx_id' => 'IDEMP001',
            'idempotency_token' => 'same-token',
        ];

        $this->post(route('orders.store', $game), $payload)->assertRedirect();
        $this->post(route('orders.store', $game), [
            ...$payload,
            'trx_id' => 'IDEMP002',
        ])->assertRedirect();

        $this->assertSame(1, Order::query()->count());
    }
}

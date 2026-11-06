<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Setting;
use App\Models\User;
use App\Services\FraudCheckService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FraudFlagTest extends TestCase
{
    use RefreshDatabase;

    public function test_large_first_order_is_flagged(): void
    {
        Setting::setValue('fraud_large_first_order_amount', '500');

        $user = User::factory()->create();
        $order = Order::factory()->for($user)->create([
            'final_amount' => 1500,
            'amount' => 1500,
            'ip_address' => '203.0.113.10',
        ]);

        // Factory afterCreating may overwrite amount — re-apply and evaluate.
        $order->forceFill(['final_amount' => 1500, 'amount' => 1500])->saveQuietly();

        $flags = app(FraudCheckService::class)->evaluateAndFlag($order->fresh());

        $this->assertContains('large_first_order', $flags);
        $this->assertTrue($order->fresh()->is_flagged);
    }

    public function test_many_orders_same_uid_are_flagged(): void
    {
        Setting::setValue('fraud_max_orders_same_uid', '2');
        Setting::setValue('fraud_window_minutes', '60');

        Order::factory()->count(2)->create([
            'player_uid' => '9998887776',
        ]);

        $order = Order::factory()->create([
            'player_uid' => '9998887776',
        ]);

        $flags = app(FraudCheckService::class)->evaluateAndFlag($order);

        $this->assertContains('many_orders_same_uid', $flags);
    }
}

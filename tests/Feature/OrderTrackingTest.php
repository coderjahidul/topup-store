<?php

namespace Tests\Feature;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OrderTrackingTest extends TestCase
{
    use RefreshDatabase;

    public function test_tracking_requires_matching_phone(): void
    {
        $order = Order::factory()->guest()->create([
            'guest_phone' => '01712345678',
            'order_number' => 'ORD-20260101-1111',
        ]);

        $this->post(route('orders.track.lookup'), [
            'order_number' => $order->order_number,
            'phone' => '01999999999',
        ])->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Orders/Track')
                ->where('order', null)
                ->where('lookupFailed', true)
            );
    }

    public function test_tracking_succeeds_with_order_number_and_phone(): void
    {
        $order = Order::factory()->guest()->completed()->create([
            'guest_phone' => '01712345678',
            'order_number' => 'ORD-20260101-2222',
        ]);

        $this->post(route('orders.track.lookup'), [
            'order_number' => $order->order_number,
            'phone' => '01712345678',
        ])->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Orders/Track')
                ->where('order.order_number', $order->order_number)
                ->where('lookupFailed', false)
                ->has('order.timeline')
            );
    }
}

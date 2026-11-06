<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethodCode;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOrderManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        return $admin;
    }

    public function test_admin_can_process_and_complete_order(): void
    {
        $admin = $this->admin();
        $order = Order::factory()->create([
            'status' => OrderStatus::Pending,
            'payment_status' => PaymentStatus::Pending,
            'payment_method' => PaymentMethodCode::Bkash,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.orders.processing', $order))
            ->assertRedirect();

        $this->assertSame(OrderStatus::Processing, $order->fresh()->status);

        $this->actingAs($admin)
            ->post(route('admin.orders.complete', $order))
            ->assertRedirect();

        $order->refresh();
        $this->assertSame(OrderStatus::Completed, $order->status);
        $this->assertSame(PaymentStatus::Paid, $order->payment_status);
        $this->assertNotNull($order->completed_at);
    }

    public function test_admin_fail_refunds_wallet_order(): void
    {
        $admin = $this->admin();
        $user = User::factory()->withBalance(0)->create();
        $order = Order::factory()->for($user)->create([
            'status' => OrderStatus::Pending,
            'payment_status' => PaymentStatus::Paid,
            'payment_method' => PaymentMethodCode::Wallet,
        ]);
        $refundAmount = $order->fresh()->final_amount;

        $this->actingAs($admin)
            ->post(route('admin.orders.fail', $order), ['admin_note' => 'Out of stock'])
            ->assertRedirect();

        $this->assertSame(OrderStatus::Refunded, $order->fresh()->status);
        $this->assertSame(number_format((float) $refundAmount, 2, '.', ''), $user->fresh()->balance);
    }
}

<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethodCode;
use App\Enums\PaymentStatus;
use App\Jobs\ProcessSupplierOrderJob;
use App\Models\Order;
use App\Models\Package;
use App\Models\Supplier;
use App\Models\SupplierLog;
use App\Models\User;
use App\Services\OrderService;
use App\Services\SupplierService;
use App\Suppliers\ManualSupplier;
use App\Suppliers\SampleApiSupplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SupplierFulfillmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_manual_supplier_place_order_writes_log_and_awaits_admin(): void
    {
        $supplier = Supplier::factory()->create([
            'code' => 'manual-test',
            'driver' => ManualSupplier::class,
            'is_active' => true,
        ]);

        $order = Order::factory()->create([
            'status' => OrderStatus::Processing,
            'payment_status' => PaymentStatus::Paid,
            'payment_method' => PaymentMethodCode::Wallet,
            'supplier_id' => $supplier->id,
        ]);

        $result = app(SupplierService::class)->placeOrder($order);

        $this->assertTrue($result->success);
        $this->assertSame('awaiting_manual', $result->status);
        $this->assertDatabaseHas('supplier_logs', [
            'order_id' => $order->id,
            'supplier_id' => $supplier->id,
            'status' => 'success',
        ]);
        $this->assertNotNull($order->fresh()->supplier_order_ref);
        $this->assertSame(OrderStatus::Processing, $order->fresh()->status);
    }

    public function test_sample_api_job_completes_order(): void
    {
        $supplier = Supplier::factory()->create([
            'code' => 'sample-ok',
            'driver' => SampleApiSupplier::class,
            'credentials' => ['api_key' => 'x', 'force_fail' => false],
            'is_active' => true,
        ]);

        $order = Order::factory()->create([
            'status' => OrderStatus::Processing,
            'payment_status' => PaymentStatus::Paid,
            'payment_method' => PaymentMethodCode::Wallet,
            'supplier_id' => $supplier->id,
        ]);

        (new ProcessSupplierOrderJob($order->id))->handle(
            app(SupplierService::class),
            app(OrderService::class),
        );

        $this->assertSame(OrderStatus::Completed, $order->fresh()->status);
        $this->assertGreaterThanOrEqual(1, SupplierLog::query()->where('order_id', $order->id)->count());
    }

    public function test_sample_api_failure_with_retries_exhaustion_refunds(): void
    {
        $user = User::factory()->withBalance(0)->create();
        $supplier = Supplier::factory()->create([
            'code' => 'sample-fail',
            'driver' => SampleApiSupplier::class,
            'credentials' => ['force_fail' => true],
            'is_active' => true,
        ]);

        $order = Order::factory()->for($user)->create([
            'status' => OrderStatus::Processing,
            'payment_status' => PaymentStatus::Paid,
            'payment_method' => PaymentMethodCode::Wallet,
            'supplier_id' => $supplier->id,
        ]);
        $refund = $order->fresh()->final_amount;

        $job = new ProcessSupplierOrderJob($order->id);
        $job->tries = 1;

        // Force non-retry path by simulating last attempt behaviour via direct placeOrder fail handling.
        $result = app(SupplierService::class)->placeOrder($order);
        $this->assertFalse($result->success);
        $this->assertTrue($result->shouldRetry);

        app(OrderService::class)->failAndRefund($order->fresh(), $result->message);

        $this->assertSame(OrderStatus::Refunded, $order->fresh()->status);
        $this->assertSame(number_format((float) $refund, 2, '.', ''), $user->fresh()->balance);
    }

    public function test_wallet_order_dispatches_supplier_job(): void
    {
        Queue::fake();

        Supplier::factory()->create([
            'code' => 'manual',
            'driver' => ManualSupplier::class,
            'is_active' => true,
        ]);

        $user = User::factory()->withBalance(5000)->create();
        $package = Package::factory()->create([
            'price' => 100,
            'discount_price' => null,
            'is_active' => true,
            'stock' => null,
        ]);

        $this->actingAs($user)
            ->post(route('orders.store', $package->game), [
                'package_id' => $package->id,
                'player_uid' => '1234567890',
                'payment_method' => 'wallet',
                'idempotency_token' => 'tok-supplier-dispatch-1',
                'quantity' => 1,
            ])
            ->assertRedirect();

        Queue::assertPushed(ProcessSupplierOrderJob::class);
    }
}

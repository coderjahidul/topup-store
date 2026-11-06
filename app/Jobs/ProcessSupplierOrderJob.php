<?php

namespace App\Jobs;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\SupplierService;
use App\Suppliers\ManualSupplier;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class ProcessSupplierOrderJob implements ShouldQueue
{
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 5;

    /**
     * @var list<int>
     */
    public array $backoff = [10, 30, 60, 180, 300];

    public function __construct(public int $orderId) {}

    public function handle(SupplierService $suppliers, OrderService $orders): void
    {
        $order = Order::query()->with(['package', 'supplier'])->find($this->orderId);

        if (! $order) {
            return;
        }

        if (in_array($order->status, [
            OrderStatus::Completed,
            OrderStatus::Cancelled,
            OrderStatus::Refunded,
            OrderStatus::Failed,
        ], true)) {
            return;
        }

        if ($order->status === OrderStatus::Pending) {
            $orders->markProcessing($order);
            $order->refresh();
        }

        $result = $suppliers->placeOrder($order->fresh(['package', 'supplier']));

        if (! $result->success) {
            if ($result->shouldRetry && $this->attempts() < $this->tries) {
                $this->release($this->backoff[min($this->attempts() - 1, count($this->backoff) - 1)]);

                return;
            }

            $orders->failAndRefund($order->fresh(), $result->message ?? 'Supplier fulfillment failed');

            return;
        }

        $driver = $order->supplier?->driver;

        // Manual driver leaves order in processing for admin completion.
        if ($driver === ManualSupplier::class || $result->status === 'awaiting_manual') {
            return;
        }

        // Sample/API stub: treat accepted placeOrder as completed after a status check.
        $status = $suppliers->checkStatus($order->fresh(['package', 'supplier']));

        if ($status->success && in_array($status->status, ['completed', 'success', 'accepted'], true)) {
            $orders->complete($order->fresh());

            return;
        }

        if ($status->shouldRetry && $this->attempts() < $this->tries) {
            $this->release($this->backoff[min($this->attempts() - 1, count($this->backoff) - 1)]);

            return;
        }

        if (! $status->success) {
            $orders->failAndRefund($order->fresh(), $status->message ?? 'Supplier status failed');
        }
    }

    public function failed(?Throwable $exception): void
    {
        $order = Order::query()->find($this->orderId);

        if (! $order || in_array($order->status, [
            OrderStatus::Completed,
            OrderStatus::Cancelled,
            OrderStatus::Refunded,
            OrderStatus::Failed,
        ], true)) {
            return;
        }

        app(OrderService::class)->failAndRefund(
            $order,
            $exception?->getMessage() ?? 'Supplier job exhausted retries',
        );
    }
}

<?php

namespace App\Services;

use App\Models\AddMoneyRequest;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Stub notification channel — SMS/email providers plug in later.
     */
    public function orderPlaced(Order $order): void
    {
        $this->log('order.placed', [
            'order_number' => $order->order_number,
            'locale' => $order->user?->locale ?? app()->getLocale(),
        ]);
    }

    public function orderCompleted(Order $order): void
    {
        $this->log('order.completed', [
            'order_number' => $order->order_number,
        ]);
    }

    public function orderFailed(Order $order): void
    {
        $this->log('order.failed', [
            'order_number' => $order->order_number,
            'status' => $order->status->value,
        ]);
    }

    public function addMoneyApproved(AddMoneyRequest $request): void
    {
        $this->log('add_money.approved', [
            'id' => $request->id,
            'user_id' => $request->user_id,
            'amount' => $request->amount,
        ]);
    }

    public function addMoneyRejected(AddMoneyRequest $request): void
    {
        $this->log('add_money.rejected', [
            'id' => $request->id,
            'user_id' => $request->user_id,
        ]);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function log(string $event, array $context = []): void
    {
        Log::info('[NotificationService] '.$event, $context);
    }
}

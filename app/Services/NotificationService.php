<?php

namespace App\Services;

use App\Jobs\SendNotificationJob;
use App\Models\AddMoneyRequest;
use App\Models\Order;
use App\Models\Package;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Queue a notification for async delivery (SMS/email drivers plug in later).
     *
     * @param  array<string, mixed>  $payload
     */
    public function queue(string $event, array $payload = [], ?string $locale = null): void
    {
        SendNotificationJob::dispatch($event, $payload, $locale);
    }

    /**
     * Immediate delivery stub used by the queued job and sync callers.
     *
     * @param  array<string, mixed>  $payload
     */
    public function deliver(string $event, array $payload = [], ?string $locale = null): void
    {
        $this->log($event, array_merge($payload, [
            'locale' => $locale ?? app()->getLocale(),
            'channels' => ['log', 'sms_stub', 'email_stub'],
        ]));
    }

    public function orderPlaced(Order $order): void
    {
        $this->queue('order.placed', [
            'order_number' => $order->order_number,
            'user_id' => $order->user_id,
            'guest_phone' => $order->guest_phone,
            'final_amount' => $order->final_amount,
        ], $order->user?->locale);
    }

    public function orderCompleted(Order $order): void
    {
        $this->queue('order.completed', [
            'order_number' => $order->order_number,
            'user_id' => $order->user_id,
            'guest_phone' => $order->guest_phone,
        ], $order->user?->locale);
    }

    public function orderFailed(Order $order): void
    {
        $this->queue('order.failed', [
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            'user_id' => $order->user_id,
        ], $order->user?->locale);
    }

    public function addMoneyApproved(AddMoneyRequest $request): void
    {
        $this->queue('add_money.approved', [
            'id' => $request->id,
            'user_id' => $request->user_id,
            'amount' => $request->amount,
        ], $request->user?->locale);
    }

    public function addMoneyRejected(AddMoneyRequest $request): void
    {
        $this->queue('add_money.rejected', [
            'id' => $request->id,
            'user_id' => $request->user_id,
        ], $request->user?->locale);
    }

    public function welcome(User $user): void
    {
        $this->queue('user.welcome', [
            'user_id' => $user->id,
            'name' => $user->name,
            'phone' => $user->phone,
        ], $user->locale);
    }

    /**
     * @param  Collection<int, Package>  $packages
     */
    public function stockAlert(Collection $packages, int $threshold): void
    {
        $this->queue('stock.low', [
            'threshold' => $threshold,
            'packages' => $packages->map(fn ($package) => [
                'id' => $package->id,
                'name' => $package->getTranslation('name', 'en'),
                'game' => $package->game?->getTranslation('name', 'en'),
                'stock' => $package->stock,
            ])->values()->all(),
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

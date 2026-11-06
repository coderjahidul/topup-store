<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Carbon;

class FraudCheckService
{
    /**
     * Evaluate fraud signals for a newly created order and persist flags.
     *
     * @return list<string>
     */
    public function evaluateAndFlag(Order $order): array
    {
        $flags = $this->evaluate($order);

        $order->forceFill([
            'fraud_flags' => $flags ?: null,
            'is_flagged' => $flags !== [],
        ])->save();

        return $flags;
    }

    /**
     * @return list<string>
     */
    public function evaluate(Order $order): array
    {
        $flags = [];
        $windowMinutes = (int) Setting::getValue('fraud_window_minutes', 60);
        $maxSameIp = (int) Setting::getValue('fraud_max_orders_same_ip', 5);
        $maxSameUid = (int) Setting::getValue('fraud_max_orders_same_uid', 4);
        $maxSamePhone = (int) Setting::getValue('fraud_max_orders_same_phone', 4);
        $largeFirstOrder = (float) Setting::getValue('fraud_large_first_order_amount', 2000);
        $since = Carbon::now()->subMinutes(max(1, $windowMinutes));

        if ($order->ip_address) {
            $ipCount = Order::query()
                ->where('ip_address', $order->ip_address)
                ->where('id', '!=', $order->id)
                ->where('created_at', '>=', $since)
                ->count();

            if ($ipCount >= $maxSameIp) {
                $flags[] = 'many_orders_same_ip';
            }
        }

        $uidCount = Order::query()
            ->where('player_uid', $order->player_uid)
            ->where('id', '!=', $order->id)
            ->where('created_at', '>=', $since)
            ->count();

        if ($uidCount >= $maxSameUid) {
            $flags[] = 'many_orders_same_uid';
        }

        $phone = $order->user_id
            ? $order->user?->phone
            : $order->guest_phone;

        if ($phone) {
            $phoneCount = Order::query()
                ->where(function ($q) use ($phone) {
                    $q->where('guest_phone', $phone)
                        ->orWhereHas('user', fn ($user) => $user->where('phone', $phone));
                })
                ->where('id', '!=', $order->id)
                ->where('created_at', '>=', $since)
                ->count();

            if ($phoneCount >= $maxSamePhone) {
                $flags[] = 'many_orders_same_phone';
            }
        }

        if ($order->user_id) {
            $priorOrders = Order::query()
                ->where('user_id', $order->user_id)
                ->where('id', '!=', $order->id)
                ->count();

            if ($priorOrders === 0 && (float) $order->final_amount >= $largeFirstOrder) {
                $flags[] = 'large_first_order';
            }
        } elseif ((float) $order->final_amount >= $largeFirstOrder) {
            $guestPrior = Order::query()
                ->whereNull('user_id')
                ->where('guest_phone', $order->guest_phone)
                ->where('id', '!=', $order->id)
                ->count();

            if ($guestPrior === 0) {
                $flags[] = 'large_first_order';
            }
        }

        return $flags;
    }
}

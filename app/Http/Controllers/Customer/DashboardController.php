<?php

namespace App\Http\Controllers\Customer;

use App\Enums\AddMoneyStatus;
use App\Enums\OrderStatus;
use App\Enums\TransactionSource;
use App\Http\Controllers\Controller;
use App\Models\AddMoneyRequest;
use App\Models\Order;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Customer dashboard overview.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $locale = app()->getLocale();

        $recentOrders = Order::query()
            ->with(['game', 'package', 'review'])
            ->where('user_id', $user->id)
            ->latest('id')
            ->limit(5)
            ->get()
            ->map(fn (Order $order) => $this->transformOrder($order, $locale));

        $recentTransactions = WalletTransaction::query()
            ->where('user_id', $user->id)
            ->latest('id')
            ->limit(5)
            ->get()
            ->map(fn (WalletTransaction $tx) => $this->transformTransaction($tx));

        $pendingAddMoney = AddMoneyRequest::query()
            ->where('user_id', $user->id)
            ->where('status', AddMoneyStatus::Pending)
            ->count();

        $referralEarnings = WalletTransaction::query()
            ->where('user_id', $user->id)
            ->where('source', TransactionSource::Referral)
            ->sum('amount');

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'balance' => $user->balance,
                'orders_count' => Order::query()->where('user_id', $user->id)->count(),
                'completed_orders' => Order::query()
                    ->where('user_id', $user->id)
                    ->where('status', OrderStatus::Completed)
                    ->count(),
                'pending_add_money' => $pendingAddMoney,
                'referral_code' => $user->referral_code,
                'referral_count' => $user->referrals()->count(),
                'referral_earnings' => round((float) $referralEarnings, 2),
            ],
            'recentOrders' => $recentOrders,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformOrder(Order $order, string $locale): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            'payment_status' => $order->payment_status->value,
            'final_amount' => $order->final_amount,
            'player_uid' => $order->player_uid,
            'game' => $order->game?->getTranslation('name', $locale),
            'game_slug' => $order->game?->slug,
            'package' => $order->package?->getTranslation('name', $locale),
            'package_id' => $order->package_id,
            'created_at' => $order->created_at?->toDateTimeString(),
            'can_review' => $order->status === OrderStatus::Completed && ! $order->review,
            'has_review' => (bool) $order->review,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformTransaction(WalletTransaction $tx): array
    {
        return [
            'id' => $tx->id,
            'type' => $tx->type->value,
            'source' => $tx->source->value,
            'amount' => $tx->amount,
            'balance_after' => $tx->balance_after,
            'note' => $tx->note,
            'created_at' => $tx->created_at?->toDateTimeString(),
        ];
    }
}

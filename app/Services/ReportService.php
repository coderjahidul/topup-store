<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Models\Game;
use App\Models\Order;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * @return array{from: Carbon, to: Carbon}
     */
    public function period(?string $from, ?string $to): array
    {
        $toDate = $to ? Carbon::parse($to)->endOfDay() : now()->endOfDay();
        $fromDate = $from ? Carbon::parse($from)->startOfDay() : now()->subDays(29)->startOfDay();

        return ['from' => $fromDate, 'to' => $toDate];
    }

    /**
     * @return array<string, mixed>
     */
    public function overview(?string $from = null, ?string $to = null): array
    {
        ['from' => $fromDate, 'to' => $toDate] = $this->period($from, $to);
        $locale = app()->getLocale();
        $paid = [PaymentStatus::Paid->value];

        $orders = Order::query()
            ->whereBetween('created_at', [$fromDate, $toDate]);

        $sales = (clone $orders)->whereIn('payment_status', $paid)->sum('final_amount');
        $orderCount = (clone $orders)->count();
        $paidCount = (clone $orders)->whereIn('payment_status', $paid)->count();

        $profit = (float) Order::query()
            ->whereBetween('orders.created_at', [$fromDate, $toDate])
            ->whereIn('orders.payment_status', $paid)
            ->join('packages', 'packages.id', '=', 'orders.package_id')
            ->selectRaw('COALESCE(SUM(orders.final_amount - COALESCE(packages.cost_price, 0) * orders.quantity), 0) as profit')
            ->value('profit');

        $byGame = Order::query()
            ->select([
                'game_id',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(final_amount) as revenue'),
            ])
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->whereIn('payment_status', $paid)
            ->groupBy('game_id')
            ->orderByDesc('revenue')
            ->limit(20)
            ->get();

        $games = Game::query()->whereIn('id', $byGame->pluck('game_id'))->get()->keyBy('id');

        $byUserRows = Order::query()
            ->select([
                'user_id',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(final_amount) as revenue'),
            ])
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->whereIn('payment_status', $paid)
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('revenue')
            ->limit(20)
            ->get();

        $users = User::query()
            ->whereIn('id', $byUserRows->pluck('user_id'))
            ->get()
            ->keyBy('id');

        $byUser = $byUserRows->map(fn ($row) => [
            'user_id' => $row->user_id,
            'name' => $users->get($row->user_id)?->name,
            'phone' => $users->get($row->user_id)?->phone,
            'orders' => (int) $row->orders_count,
            'revenue' => round((float) $row->revenue, 2),
        ]);

        $walletCredits = WalletTransaction::query()
            ->where('type', 'credit')
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->sum('amount');

        $walletDebits = WalletTransaction::query()
            ->where('type', 'debit')
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->sum('amount');

        return [
            'from' => $fromDate->toDateString(),
            'to' => $toDate->toDateString(),
            'sales' => round((float) $sales, 2),
            'profit' => round($profit, 2),
            'orders_count' => $orderCount,
            'paid_orders' => $paidCount,
            'wallet_credits' => round((float) $walletCredits, 2),
            'wallet_debits' => round((float) $walletDebits, 2),
            'by_game' => $byGame->map(fn ($row) => [
                'game' => $games->get($row->game_id)?->getTranslation('name', $locale) ?? '—',
                'orders' => (int) $row->orders_count,
                'revenue' => round((float) $row->revenue, 2),
            ])->values(),
            'by_user' => $byUser->values(),
        ];
    }

    public function salesRows(?string $from = null, ?string $to = null): Collection
    {
        ['from' => $fromDate, 'to' => $toDate] = $this->period($from, $to);
        $locale = app()->getLocale();

        return Order::query()
            ->with(['game', 'package', 'user'])
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->latest('id')
            ->get()
            ->map(fn (Order $order) => [
                'order_number' => $order->order_number,
                'date' => $order->created_at?->toDateTimeString(),
                'game' => $order->game?->getTranslation('name', $locale),
                'package' => $order->package?->getTranslation('name', $locale),
                'player_uid' => $order->player_uid,
                'customer' => $order->user?->name ?? $order->guest_name,
                'phone' => $order->user?->phone ?? $order->guest_phone,
                'payment_method' => $order->payment_method->value,
                'payment_status' => $order->payment_status->value,
                'status' => $order->status->value,
                'amount' => $order->final_amount,
                'flagged' => $order->is_flagged ? 'yes' : 'no',
            ]);
    }

    public function walletRows(?string $from = null, ?string $to = null): Collection
    {
        ['from' => $fromDate, 'to' => $toDate] = $this->period($from, $to);

        return WalletTransaction::query()
            ->with('user')
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->latest('id')
            ->get()
            ->map(fn (WalletTransaction $tx) => [
                'id' => $tx->id,
                'date' => $tx->created_at?->toDateTimeString(),
                'user' => $tx->user?->name,
                'phone' => $tx->user?->phone,
                'type' => $tx->type->value,
                'source' => $tx->source->value,
                'amount' => $tx->amount,
                'balance_before' => $tx->balance_before,
                'balance_after' => $tx->balance_after,
                'note' => $tx->note,
            ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AddMoneyStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\AddMoneyRequest;
use App\Models\Game;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $today = Carbon::today();
        $weekStart = Carbon::now()->startOfWeek();
        $monthStart = Carbon::now()->startOfMonth();
        $locale = app()->getLocale();
        $paid = [PaymentStatus::Paid->value];

        $salesBetween = fn (Carbon $from): float => (float) Order::query()
            ->whereIn('payment_status', $paid)
            ->where('created_at', '>=', $from)
            ->sum('final_amount');

        $profitMonth = (float) Order::query()
            ->whereIn('orders.payment_status', $paid)
            ->where('orders.created_at', '>=', $monthStart)
            ->join('packages', 'packages.id', '=', 'orders.package_id')
            ->selectRaw('COALESCE(SUM(orders.final_amount - COALESCE(packages.cost_price, 0) * orders.quantity), 0) as profit')
            ->value('profit');

        $topGameRows = Order::query()
            ->select([
                'game_id',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(final_amount) as revenue'),
            ])
            ->whereIn('payment_status', $paid)
            ->where('created_at', '>=', $monthStart)
            ->groupBy('game_id')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        $games = Game::query()
            ->whereIn('id', $topGameRows->pluck('game_id'))
            ->get()
            ->keyBy('id');

        $salesChart = Order::query()
            ->select([
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(final_amount) as total'),
            ])
            ->whereIn('payment_status', $paid)
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'total' => round((float) $row->total, 2),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'today_sales' => round($salesBetween($today), 2),
                'week_sales' => round($salesBetween($weekStart), 2),
                'month_sales' => round($salesBetween($monthStart), 2),
                'profit_month' => round((float) $profitMonth, 2),
                'pending_orders' => Order::query()->where('status', OrderStatus::Pending)->count(),
                'processing_orders' => Order::query()->where('status', OrderStatus::Processing)->count(),
                'pending_add_money' => AddMoneyRequest::query()->where('status', AddMoneyStatus::Pending)->count(),
                'new_users_month' => User::query()->where('created_at', '>=', $monthStart)->count(),
                'top_games' => $topGameRows->map(fn ($row) => [
                    'name' => $games->get($row->game_id)?->getTranslation('name', $locale) ?? '—',
                    'orders' => (int) $row->orders_count,
                    'revenue' => round((float) $row->revenue, 2),
                ])->values(),
                'sales_chart' => $salesChart,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function index(Request $request): Response
    {
        $locale = app()->getLocale();
        $filters = [
            'status' => $request->string('status')->toString(),
            'payment_method' => $request->string('payment_method')->toString(),
            'search' => $request->string('search')->toString(),
            'game_id' => $request->integer('game_id') ?: null,
        ];

        $orders = Order::query()
            ->with(['game', 'package', 'user'])
            ->when($filters['status'], fn ($q, $status) => $q->where('status', $status))
            ->when($filters['payment_method'], fn ($q, $method) => $q->where('payment_method', $method))
            ->when($filters['game_id'], fn ($q, $gameId) => $q->where('game_id', $gameId))
            ->when($filters['search'], function ($q, $search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('order_number', 'like', "%{$search}%")
                        ->orWhere('player_uid', 'like', "%{$search}%")
                        ->orWhere('guest_phone', 'like', "%{$search}%")
                        ->orWhere('trx_id', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'game' => $order->game?->getTranslation('name', $locale),
                'package' => $order->package?->getTranslation('name', $locale),
                'player_uid' => $order->player_uid,
                'final_amount' => $order->final_amount,
                'payment_method' => $order->payment_method->value,
                'status' => $order->status->value,
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $filters,
            'games' => Game::query()->orderBy('sort_order')->get()->map(fn (Game $game) => [
                'id' => $game->id,
                'name' => $game->getTranslation('name', $locale),
            ]),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['game', 'package', 'user', 'review']);
        $locale = app()->getLocale();

        $duplicateUidCount = Order::query()
            ->where('player_uid', $order->player_uid)
            ->where('id', '!=', $order->id)
            ->where('created_at', '>=', now()->subDay())
            ->count();

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'payment_status' => $order->payment_status->value,
                'payment_method' => $order->payment_method->value,
                'amount' => $order->amount,
                'discount_amount' => $order->discount_amount,
                'final_amount' => $order->final_amount,
                'player_uid' => $order->player_uid,
                'server' => $order->server,
                'trx_id' => $order->trx_id,
                'sender_number' => $order->sender_number,
                'guest_name' => $order->guest_name,
                'guest_phone' => $order->guest_phone,
                'user_name' => $order->user?->name,
                'user_phone' => $order->user?->phone,
                'game_name' => $order->game?->getTranslation('name', $locale),
                'package_name' => $order->package?->getTranslation('name', $locale),
                'admin_note' => $order->admin_note,
                'ip_address' => $order->ip_address,
                'created_at' => $order->created_at?->toDateTimeString(),
                'completed_at' => $order->completed_at?->toDateTimeString(),
                'duplicate_uid_count' => $duplicateUidCount,
                'can_process' => $order->status === OrderStatus::Pending,
                'can_complete' => in_array($order->status, [OrderStatus::Pending, OrderStatus::Processing], true),
                'can_fail' => ! in_array($order->status, [OrderStatus::Completed, OrderStatus::Failed, OrderStatus::Refunded, OrderStatus::Cancelled], true),
                'can_cancel' => ! in_array($order->status, [OrderStatus::Completed, OrderStatus::Cancelled, OrderStatus::Refunded], true),
            ],
        ]);
    }

    public function processing(Order $order): RedirectResponse
    {
        $this->orderService->markProcessing($order, dispatchSupplier: true);
        activity()->causedBy(auth()->user())->performedOn($order)->log('order marked processing');

        return back()->with('success', 'Order marked processing.');
    }

    public function complete(Order $order): RedirectResponse
    {
        $this->orderService->complete($order);
        activity()->causedBy(auth()->user())->performedOn($order)->log('order completed');

        return back()->with('success', 'Order completed.');
    }

    public function fail(Request $request, Order $order): RedirectResponse
    {
        $note = $request->string('admin_note')->toString() ?: null;
        $this->orderService->failAndRefund($order, $note);
        activity()->causedBy(auth()->user())->performedOn($order)->log('order failed');

        return back()->with('success', 'Order failed and refunded if applicable.');
    }

    public function cancel(Request $request, Order $order): RedirectResponse
    {
        $note = $request->string('admin_note')->toString() ?: null;
        $this->orderService->cancel($order, $note);
        activity()->causedBy(auth()->user())->performedOn($order)->log('order cancelled');

        return back()->with('success', 'Order cancelled.');
    }

    public function note(Request $request, Order $order): RedirectResponse
    {
        $request->validate(['admin_note' => ['nullable', 'string', 'max:2000']]);
        $this->orderService->updateAdminNote($order, (string) $request->input('admin_note', ''));

        return back()->with('success', 'Note saved.');
    }
}

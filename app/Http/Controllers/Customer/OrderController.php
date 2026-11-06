<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * List the authenticated user's orders.
     */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $orders = Order::query()
            ->with(['game', 'package', 'review'])
            ->where('user_id', $request->user()->id)
            ->latest('id')
            ->paginate(10)
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'payment_status' => $order->payment_status->value,
                'payment_method' => $order->payment_method->value,
                'final_amount' => $order->final_amount,
                'player_uid' => $order->player_uid,
                'server' => $order->server,
                'trx_id' => $order->trx_id,
                'game' => $order->game?->getTranslation('name', $locale),
                'game_slug' => $order->game?->slug,
                'package' => $order->package?->getTranslation('name', $locale),
                'package_id' => $order->package_id,
                'created_at' => $order->created_at?->toDateTimeString(),
                'completed_at' => $order->completed_at?->toDateTimeString(),
                'can_review' => $order->status === OrderStatus::Completed && ! $order->review,
                'has_review' => (bool) $order->review,
                'review_rating' => $order->review?->rating,
            ]);

        return Inertia::render('Customer/Orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show a single owned order.
     */
    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $order->load(['game', 'package', 'review']);
        $locale = app()->getLocale();

        return Inertia::render('Customer/OrderShow', [
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
                'game' => $order->game?->getTranslation('name', $locale),
                'game_slug' => $order->game?->slug,
                'package' => $order->package?->getTranslation('name', $locale),
                'package_id' => $order->package_id,
                'created_at' => $order->created_at?->toDateTimeString(),
                'completed_at' => $order->completed_at?->toDateTimeString(),
                'can_review' => $order->status === OrderStatus::Completed && ! $order->review,
                'review' => $order->review ? [
                    'rating' => $order->review->rating,
                    'comment' => $order->review->comment,
                    'is_approved' => $order->review->is_approved,
                ] : null,
            ],
        ]);
    }

    /**
     * Redirect to the game page prefilled for re-order.
     */
    public function reorder(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        abort_unless($order->game?->is_active, 404);

        return redirect()->route('games.show', [
            'game' => $order->game->slug,
            'package' => $order->package_id,
            'uid' => $order->player_uid,
            'server' => $order->server,
        ]);
    }
}

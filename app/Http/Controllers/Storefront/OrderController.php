<?php

namespace App\Http\Controllers\Storefront;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreOrderRequest;
use App\Models\Game;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;

class OrderController extends Controller
{
    /**
     * Place a guest or authenticated order.
     */
    public function store(StoreOrderRequest $request, Game $game, OrderService $orders): RedirectResponse
    {
        abort_unless($game->is_active, 404);

        try {
            $order = $orders->create($game, [
                ...$request->validated(),
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ], $request->user());
        } catch (InsufficientBalanceException $exception) {
            return $exception->render($request);
        }

        return redirect()
            ->route('orders.track.show', [
                'order_number' => $order->order_number,
                'phone' => $order->customerPhone(),
            ])
            ->with(
                'success',
                app()->getLocale() === 'bn'
                    ? 'অর্ডার তৈরি হয়েছে: '.$order->order_number
                    : 'Order placed: '.$order->order_number
            );
    }
}

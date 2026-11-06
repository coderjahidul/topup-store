<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\TrackOrderRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderTrackingController extends Controller
{
    /**
     * Show the public order tracking form.
     */
    public function create(): Response
    {
        return Inertia::render('Orders/Track', [
            'order' => null,
        ]);
    }

    /**
     * Look up an order by order number + phone.
     */
    public function store(TrackOrderRequest $request, OrderService $orders): Response
    {
        $order = $orders->findForTracking(
            $request->string('order_number')->toString(),
            $request->string('phone')->toString(),
        );

        if (! $order) {
            return Inertia::render('Orders/Track', [
                'order' => null,
                'lookupFailed' => true,
                'filters' => $request->only(['order_number', 'phone']),
            ]);
        }

        return Inertia::render('Orders/Track', [
            'order' => $this->transform($order),
            'lookupFailed' => false,
            'filters' => $request->only(['order_number', 'phone']),
        ]);
    }

    /**
     * Direct link after checkout with query params.
     */
    public function show(Request $request, OrderService $orders): Response
    {
        $validated = $request->validate([
            'order_number' => ['required', 'string', 'max:40'],
            'phone' => ['required', 'regex:/^01[3-9]\d{8}$/'],
        ]);

        $order = $orders->findForTracking($validated['order_number'], $validated['phone']);

        return Inertia::render('Orders/Track', [
            'order' => $order ? $this->transform($order) : null,
            'lookupFailed' => $order === null,
            'filters' => $validated,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(Order $order): array
    {
        $locale = app()->getLocale();

        return [
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            'payment_status' => $order->payment_status->value,
            'payment_method' => $order->payment_method->value,
            'player_uid' => $order->player_uid,
            'server' => $order->server,
            'final_amount' => $order->final_amount,
            'trx_id' => $order->trx_id,
            'game' => $order->game?->getTranslation('name', $locale),
            'package' => $order->package?->getTranslation('name', $locale),
            'created_at' => $order->created_at?->toDateTimeString(),
            'completed_at' => $order->completed_at?->toDateTimeString(),
            'timeline' => [
                ['key' => 'pending', 'done' => true],
                [
                    'key' => 'processing',
                    'done' => in_array($order->status->value, ['processing', 'completed'], true),
                ],
                [
                    'key' => 'completed',
                    'done' => $order->status->value === 'completed',
                ],
            ],
        ];
    }
}

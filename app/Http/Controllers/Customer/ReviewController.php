<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreReviewRequest;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    /**
     * Store a review for a completed owned order.
     */
    public function store(StoreReviewRequest $request, Order $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        abort_unless($order->status === OrderStatus::Completed, 422);

        if ($order->review()->exists()) {
            return back()->with(
                'error',
                app()->getLocale() === 'bn'
                    ? 'এই অর্ডারে ইতিমধ্যে রিভিউ আছে।'
                    : 'This order already has a review.'
            );
        }

        Review::query()->create([
            'order_id' => $order->id,
            'user_id' => $request->user()->id,
            'name' => $request->user()->name,
            'rating' => $request->integer('rating'),
            'comment' => $request->string('comment')->toString() ?: null,
            'is_approved' => false,
        ]);

        return back()->with(
            'success',
            app()->getLocale() === 'bn'
                ? 'রিভিউ জমা হয়েছে। অনুমোদনের পর দেখানো হবে।'
                : 'Review submitted. It will appear after approval.'
        );
    }
}

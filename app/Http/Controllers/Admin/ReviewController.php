<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $approved = $request->string('approved')->toString();

        $reviews = Review::query()
            ->with(['user', 'order.game'])
            ->when($approved === '1', fn ($q) => $q->where('is_approved', true))
            ->when($approved === '0', fn ($q) => $q->where('is_approved', false))
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Review $review) => [
                'id' => $review->id,
                'name' => $review->name,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'is_approved' => $review->is_approved,
                'order_number' => $review->order?->order_number,
                'created_at' => $review->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'filters' => ['approved' => $approved],
        ]);
    }

    public function approve(Review $review): RedirectResponse
    {
        $review->forceFill(['is_approved' => true])->save();
        activity()->causedBy(auth()->user())->performedOn($review)->log('review approved');

        return back()->with('success', 'Review approved.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        return back()->with('success', 'Review deleted.');
    }
}

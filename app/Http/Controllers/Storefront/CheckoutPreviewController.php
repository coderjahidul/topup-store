<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\PrepareOrderRequest;
use App\Models\Game;
use App\Models\Package;
use Illuminate\Http\RedirectResponse;

class CheckoutPreviewController extends Controller
{
    /**
     * Validate checkout payload for Phase 3 (order creation lands in Phase 4).
     */
    public function __invoke(PrepareOrderRequest $request, Game $game): RedirectResponse
    {
        abort_unless($game->is_active, 404);

        Package::query()
            ->whereKey($request->integer('package_id'))
            ->where('game_id', $game->id)
            ->active()
            ->firstOrFail();

        $message = app()->getLocale() === 'bn'
            ? 'অর্ডার তথ্য সঠিক। পেমেন্ট ও অর্ডার তৈরি পরবর্তী ধাপে চালু হবে।'
            : 'Order details look good. Payment and order placement will go live in the next phase.';

        return back()->with('success', $message);
    }
}

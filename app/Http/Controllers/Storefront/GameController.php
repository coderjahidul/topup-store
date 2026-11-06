<?php

namespace App\Http\Controllers\Storefront;

use App\Enums\PaymentMethodCode;
use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\PaymentMethod;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    /**
     * Show a game top-up page with packages and checkout fields.
     */
    public function show(Request $request, Game $game): Response
    {
        abort_unless($game->is_active, 404);

        $locale = app()->getLocale();

        $game->load(['packages' => fn ($query) => $query->active()->ordered()]);

        $paymentMethods = PaymentMethod::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn (PaymentMethod $method) => [
                'id' => $method->id,
                'name' => $method->name,
                'code' => $method->code,
                'account_number' => $method->account_number,
                'account_type' => $method->account_type->value,
                'instruction' => $method->getTranslation('instruction', $locale),
                'min_amount' => $method->min_amount,
                'max_amount' => $method->max_amount,
            ]);

        $methods = $paymentMethods->values()->all();

        if ($request->user()) {
            array_unshift($methods, [
                'id' => null,
                'name' => 'Wallet',
                'code' => PaymentMethodCode::Wallet->value,
                'account_number' => null,
                'account_type' => null,
                'instruction' => $locale === 'bn'
                    ? 'ওয়ালেট ব্যালেন্স থেকে তাৎক্ষণিক কাটা হবে।'
                    : 'Instant debit from your wallet balance.',
                'min_amount' => null,
                'max_amount' => null,
                'balance' => $request->user()->balance,
            ]);
        }

        return Inertia::render('Games/Show', [
            'game' => [
                'id' => $game->id,
                'slug' => $game->slug,
                'name' => $game->getTranslation('name', $locale),
                'description' => $game->getTranslation('description', $locale),
                'image' => $game->image,
                'banner' => $game->banner,
                'uid_label' => $game->getTranslation('uid_label', $locale),
                'requires_server' => $game->requires_server,
                'servers' => $game->servers ?? [],
                'packages' => $game->packages->map(fn ($package) => [
                    'id' => $package->id,
                    'name' => $package->getTranslation('name', $locale),
                    'price' => $package->price,
                    'discount_price' => $package->discount_price,
                    'stock' => $package->stock,
                ]),
            ],
            'paymentMethods' => $methods,
            'lastPlayerUid' => $request->user()?->last_player_uid,
            'authUser' => $request->user() ? [
                'name' => $request->user()->name,
                'phone' => $request->user()->phone,
                'email' => $request->user()->email,
                'balance' => $request->user()->balance,
            ] : null,
            'supportWhatsapp' => Setting::getValue('support_whatsapp'),
            'checkoutEnabled' => true,
        ]);
    }
}

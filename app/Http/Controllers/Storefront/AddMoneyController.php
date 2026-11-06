<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreAddMoneyRequest;
use App\Models\PaymentMethod;
use App\Services\AddMoneyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddMoneyController extends Controller
{
    /**
     * Show add-money form.
     */
    public function create(Request $request): Response
    {
        $locale = app()->getLocale();

        $methods = PaymentMethod::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn (PaymentMethod $method) => [
                'id' => $method->id,
                'name' => $method->name,
                'code' => $method->code,
                'account_number' => $method->account_number,
                'instruction' => $method->getTranslation('instruction', $locale),
                'min_amount' => $method->min_amount,
                'max_amount' => $method->max_amount,
            ]);

        return Inertia::render('Wallet/AddMoney', [
            'paymentMethods' => $methods,
            'balance' => $request->user()->balance,
        ]);
    }

    /**
     * Submit an add-money request.
     */
    public function store(StoreAddMoneyRequest $request, AddMoneyService $addMoney): RedirectResponse
    {
        $addMoney->submit($request->user(), $request->validated());

        return redirect()
            ->route('wallet.add-money')
            ->with(
                'success',
                app()->getLocale() === 'bn'
                    ? 'অ্যাড মানি রিকোয়েস্ট জমা হয়েছে। অ্যাডমিন অনুমোদনের অপেক্ষায়।'
                    : 'Add money request submitted. Waiting for admin approval.'
            );
    }
}

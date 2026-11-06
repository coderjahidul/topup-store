<?php

namespace App\Http\Controllers\Customer;

use App\Enums\TransactionSource;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReferralController extends Controller
{
    /**
     * Show referral code and earnings.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $referrals = User::query()
            ->where('referred_by', $user->id)
            ->latest('id')
            ->limit(20)
            ->get(['id', 'name', 'phone', 'created_at'])
            ->map(fn (User $referral) => [
                'id' => $referral->id,
                'name' => $referral->name,
                'phone' => substr($referral->phone, 0, 3).'****'.substr($referral->phone, -2),
                'joined_at' => $referral->created_at?->toDateString(),
            ]);

        $earnings = WalletTransaction::query()
            ->where('user_id', $user->id)
            ->where('source', TransactionSource::Referral)
            ->sum('amount');

        return Inertia::render('Customer/Referral', [
            'referralCode' => $user->referral_code,
            'referralCount' => $user->referrals()->count(),
            'referralEarnings' => round((float) $earnings, 2),
            'referrals' => $referrals,
            'shareUrl' => url('/register?ref='.$user->referral_code),
        ]);
    }
}

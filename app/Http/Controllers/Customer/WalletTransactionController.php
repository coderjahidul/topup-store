<?php

namespace App\Http\Controllers\Customer;

use App\Enums\AddMoneyStatus;
use App\Http\Controllers\Controller;
use App\Models\AddMoneyRequest;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletTransactionController extends Controller
{
    /**
     * Wallet ledger and add-money request history.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $transactions = WalletTransaction::query()
            ->where('user_id', $user->id)
            ->latest('id')
            ->paginate(15)
            ->through(fn (WalletTransaction $tx) => [
                'id' => $tx->id,
                'type' => $tx->type->value,
                'source' => $tx->source->value,
                'amount' => $tx->amount,
                'balance_before' => $tx->balance_before,
                'balance_after' => $tx->balance_after,
                'trx_id' => $tx->trx_id,
                'note' => $tx->note,
                'created_at' => $tx->created_at?->toDateTimeString(),
            ]);

        $addMoneyRequests = AddMoneyRequest::query()
            ->with('paymentMethod')
            ->where('user_id', $user->id)
            ->latest('id')
            ->limit(10)
            ->get()
            ->map(fn (AddMoneyRequest $item) => [
                'id' => $item->id,
                'amount' => $item->amount,
                'status' => $item->status->value,
                'trx_id' => $item->trx_id,
                'payment_method' => $item->paymentMethod?->name,
                'created_at' => $item->created_at?->toDateTimeString(),
                'is_pending' => $item->status === AddMoneyStatus::Pending,
            ]);

        return Inertia::render('Customer/Transactions', [
            'balance' => $user->balance,
            'transactions' => $transactions,
            'addMoneyRequests' => $addMoneyRequests,
        ]);
    }
}

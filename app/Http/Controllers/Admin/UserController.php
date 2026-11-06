<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TransactionSource;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $users = User::query()
            ->with('roles')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'balance' => $user->balance,
                'status' => $user->status->value,
                'roles' => $user->getRoleNames()->values(),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function show(User $user): Response
    {
        $locale = app()->getLocale();
        $user->load('roles');

        $orders = $user->orders()
            ->with(['game', 'package'])
            ->latest('id')
            ->limit(10)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'final_amount' => $order->final_amount,
                'game' => $order->game?->getTranslation('name', $locale),
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);

        $transactions = $user->walletTransactions()
            ->latest('id')
            ->limit(10)
            ->get()
            ->map(fn ($tx) => [
                'id' => $tx->id,
                'type' => $tx->type->value,
                'source' => $tx->source->value,
                'amount' => $tx->amount,
                'balance_after' => $tx->balance_after,
                'note' => $tx->note,
                'created_at' => $tx->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'balance' => $user->balance,
                'status' => $user->status->value,
                'locale' => $user->locale,
                'referral_code' => $user->referral_code,
                'roles' => $user->getRoleNames()->values(),
            ],
            'recentOrders' => $orders,
            'recentTransactions' => $transactions,
            'roles' => Role::query()->orderBy('name')->pluck('name'),
        ]);
    }

    public function block(User $user): RedirectResponse
    {
        $user->forceFill(['status' => UserStatus::Blocked])->save();
        activity()->causedBy(auth()->user())->performedOn($user)->log('user blocked');

        return back()->with('success', 'User blocked.');
    }

    public function unblock(User $user): RedirectResponse
    {
        $user->forceFill(['status' => UserStatus::Active])->save();
        activity()->causedBy(auth()->user())->performedOn($user)->log('user unblocked');

        return back()->with('success', 'User unblocked.');
    }

    public function adjustBalance(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'type' => ['required', Rule::in(['credit', 'debit'])],
            'note' => ['required', 'string', 'max:500'],
        ]);

        if ($data['type'] === 'credit') {
            $this->walletService->credit(
                $user,
                $data['amount'],
                TransactionSource::AdminAdjust,
                null,
                null,
                $data['note'],
            );
        } else {
            $this->walletService->debit(
                $user,
                $data['amount'],
                TransactionSource::AdminAdjust,
                null,
                null,
                $data['note'],
            );
        }

        activity()->causedBy($request->user())->performedOn($user)->log('balance adjusted: '.$data['type']);

        return back()->with('success', 'Balance updated.');
    }

    public function updateRoles(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'roles' => ['required', 'array'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
        ]);

        $user->syncRoles($data['roles']);
        activity()->causedBy($request->user())->performedOn($user)->log('roles updated');

        return back()->with('success', 'Roles updated.');
    }
}

<?php

namespace App\Services;

use App\Enums\AddMoneyStatus;
use App\Enums\TransactionSource;
use App\Models\AddMoneyRequest;
use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class AddMoneyService
{
    public function __construct(
        private WalletService $walletService,
        private PaymentVerificationService $paymentVerification,
        private NotificationService $notificationService,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function submit(User $user, array $data): AddMoneyRequest
    {
        try {
            $trxId = $this->paymentVerification->normalizeTrxId($data['trx_id'] ?? null);

            if (! $trxId) {
                throw ValidationException::withMessages([
                    'trx_id' => app()->getLocale() === 'bn' ? 'TrxID আবশ্যক।' : 'TrxID is required.',
                ]);
            }

            $this->paymentVerification->assertUniqueTrxId($trxId);
        } catch (InvalidArgumentException $exception) {
            throw ValidationException::withMessages([
                'trx_id' => $exception->getMessage(),
            ]);
        }

        $method = PaymentMethod::query()
            ->active()
            ->whereKey($data['payment_method_id'])
            ->firstOrFail();

        $amount = round((float) $data['amount'], 2);

        if ($amount < (float) $method->min_amount || $amount > (float) $method->max_amount) {
            throw ValidationException::withMessages([
                'amount' => app()->getLocale() === 'bn'
                    ? 'অ্যামাউন্ট অনুমোদিত সীমার বাইরে।'
                    : 'Amount is outside the allowed range.',
            ]);
        }

        return AddMoneyRequest::query()->create([
            'user_id' => $user->id,
            'payment_method_id' => $method->id,
            'amount' => $amount,
            'sender_number' => $data['sender_number'],
            'trx_id' => $trxId,
            'status' => AddMoneyStatus::Pending,
        ]);
    }

    public function approve(AddMoneyRequest $request, User $admin, ?string $note = null): AddMoneyRequest
    {
        return DB::transaction(function () use ($request, $admin, $note) {
            /** @var AddMoneyRequest $locked */
            $locked = AddMoneyRequest::query()->whereKey($request->id)->lockForUpdate()->firstOrFail();

            if ($locked->status !== AddMoneyStatus::Pending) {
                return $locked;
            }

            $user = User::query()->whereKey($locked->user_id)->lockForUpdate()->firstOrFail();

            $this->walletService->credit(
                $user,
                $locked->amount,
                TransactionSource::AddMoney,
                $locked,
                $locked->trx_id,
                $note ?? 'Add money approved',
            );

            $locked->forceFill([
                'status' => AddMoneyStatus::Approved,
                'admin_id' => $admin->id,
                'admin_note' => $note,
            ])->save();

            $this->notificationService->addMoneyApproved($locked->fresh());

            return $locked->fresh();
        });
    }

    public function reject(AddMoneyRequest $request, User $admin, ?string $note = null): AddMoneyRequest
    {
        return DB::transaction(function () use ($request, $admin, $note) {
            /** @var AddMoneyRequest $locked */
            $locked = AddMoneyRequest::query()->whereKey($request->id)->lockForUpdate()->firstOrFail();

            if ($locked->status !== AddMoneyStatus::Pending) {
                return $locked;
            }

            $locked->forceFill([
                'status' => AddMoneyStatus::Rejected,
                'admin_id' => $admin->id,
                'admin_note' => $note,
            ])->save();

            $this->notificationService->addMoneyRejected($locked->fresh());

            return $locked->fresh();
        });
    }
}

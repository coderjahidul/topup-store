<?php

namespace App\Services;

use App\Enums\TransactionSource;
use App\Enums\TransactionType;
use App\Exceptions\InsufficientBalanceException;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WalletService
{
    /**
     * Credit a user's wallet and write an immutable ledger row.
     */
    public function credit(
        User $user,
        float|string $amount,
        TransactionSource $source,
        ?Model $reference = null,
        ?string $trxId = null,
        ?string $note = null,
    ): WalletTransaction {
        return $this->write($user, TransactionType::Credit, $amount, $source, $reference, $trxId, $note);
    }

    /**
     * Debit a user's wallet and write an immutable ledger row.
     */
    public function debit(
        User $user,
        float|string $amount,
        TransactionSource $source,
        ?Model $reference = null,
        ?string $trxId = null,
        ?string $note = null,
    ): WalletTransaction {
        return $this->write($user, TransactionType::Debit, $amount, $source, $reference, $trxId, $note);
    }

    private function write(
        User $user,
        TransactionType $type,
        float|string $amount,
        TransactionSource $source,
        ?Model $reference,
        ?string $trxId,
        ?string $note,
    ): WalletTransaction {
        $amount = round((float) $amount, 2);

        if ($amount <= 0) {
            throw new InvalidArgumentException('Wallet amount must be greater than zero.');
        }

        return DB::transaction(function () use ($user, $type, $amount, $source, $reference, $trxId, $note) {
            /** @var User $locked */
            $locked = User::query()->whereKey($user->id)->lockForUpdate()->firstOrFail();

            $before = round((float) $locked->balance, 2);

            if ($type === TransactionType::Debit && $before < $amount) {
                throw new InsufficientBalanceException;
            }

            $after = $type === TransactionType::Credit
                ? round($before + $amount, 2)
                : round($before - $amount, 2);

            $locked->forceFill(['balance' => $after])->save();

            return WalletTransaction::query()->create([
                'user_id' => $locked->id,
                'type' => $type,
                'source' => $source,
                'amount' => $amount,
                'balance_before' => $before,
                'balance_after' => $after,
                'reference_type' => $reference ? $reference::class : null,
                'reference_id' => $reference?->getKey(),
                'trx_id' => $trxId,
                'note' => $note,
            ]);
        });
    }
}

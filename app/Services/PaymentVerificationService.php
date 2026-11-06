<?php

namespace App\Services;

use App\Models\AddMoneyRequest;
use App\Models\Order;
use InvalidArgumentException;

class PaymentVerificationService
{
    /**
     * Normalize a TrxID for storage and comparison.
     */
    public function normalizeTrxId(?string $trxId): ?string
    {
        if ($trxId === null || trim($trxId) === '') {
            return null;
        }

        $normalized = strtoupper(preg_replace('/\s+/', '', trim($trxId)) ?? '');

        if (strlen($normalized) < 6 || strlen($normalized) > 40) {
            throw new InvalidArgumentException(
                app()->getLocale() === 'bn'
                    ? 'TrxID অবৈধ।'
                    : 'Invalid TrxID.'
            );
        }

        return $normalized;
    }

    /**
     * Ensure TrxID has not already been used on an order or add-money request.
     */
    public function assertUniqueTrxId(string $trxId, ?int $ignoreOrderId = null): void
    {
        $orderExists = Order::query()
            ->where('trx_id', $trxId)
            ->when($ignoreOrderId, fn ($query) => $query->whereKeyNot($ignoreOrderId))
            ->exists();

        $addMoneyExists = AddMoneyRequest::query()
            ->where('trx_id', $trxId)
            ->exists();

        if ($orderExists || $addMoneyExists) {
            throw new InvalidArgumentException(
                app()->getLocale() === 'bn'
                    ? 'এই TrxID ইতিমধ্যে ব্যবহৃত হয়েছে।'
                    : 'This TrxID has already been used.'
            );
        }
    }
}

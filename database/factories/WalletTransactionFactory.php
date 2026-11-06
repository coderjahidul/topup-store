<?php

namespace Database\Factories;

use App\Enums\TransactionSource;
use App\Enums\TransactionType;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WalletTransaction>
 */
class WalletTransactionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = fake()->randomFloat(2, 10, 1000);
        $before = fake()->randomFloat(2, 0, 5000);

        return [
            'user_id' => User::factory(),
            'type' => TransactionType::Credit,
            'source' => TransactionSource::AddMoney,
            'amount' => $amount,
            'balance_before' => $before,
            'balance_after' => $before + $amount,
            'reference_type' => null,
            'reference_id' => null,
            'trx_id' => strtoupper(fake()->unique()->bothify('WTX########')),
            'note' => null,
        ];
    }

    public function debit(): static
    {
        return $this->state(function (array $attributes) {
            $amount = (float) $attributes['amount'];
            $before = (float) $attributes['balance_before'];

            return [
                'type' => TransactionType::Debit,
                'source' => TransactionSource::Order,
                'balance_after' => max(0, $before - $amount),
            ];
        });
    }
}

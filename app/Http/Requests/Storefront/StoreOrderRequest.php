<?php

namespace App\Http\Requests\Storefront;

use App\Enums\PaymentMethodCode;
use App\Models\Game;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Game $game */
        $game = $this->route('game');

        return [
            'package_id' => [
                'required',
                'integer',
                Rule::exists('packages', 'id')->where(fn ($query) => $query
                    ->where('game_id', $game->id)
                    ->where('is_active', true)
                    ->whereNull('deleted_at')),
            ],
            'player_uid' => ['required', 'string', 'min:3', 'max:64'],
            'server' => [
                Rule::requiredIf(fn () => (bool) $game->requires_server),
                'nullable',
                'string',
                'max:100',
            ],
            'payment_method' => ['required', 'string', Rule::enum(PaymentMethodCode::class)],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'guest_name' => [Rule::requiredIf(fn () => ! $this->user()), 'nullable', 'string', 'max:120'],
            'guest_phone' => [
                Rule::requiredIf(fn () => ! $this->user()),
                'nullable',
                'regex:/^01[3-9]\d{8}$/',
            ],
            'guest_email' => ['nullable', 'email', 'max:255'],
            'sender_number' => [
                Rule::requiredIf(fn () => $this->input('payment_method') !== PaymentMethodCode::Wallet->value),
                'nullable',
                'regex:/^01[3-9]\d{8}$/',
            ],
            'trx_id' => [
                Rule::requiredIf(fn () => $this->input('payment_method') !== PaymentMethodCode::Wallet->value),
                'nullable',
                'string',
                'min:6',
                'max:40',
            ],
            'idempotency_token' => ['required', 'string', 'max:64'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('trx_id')) {
            $this->merge([
                'trx_id' => strtoupper(trim((string) $this->input('trx_id'))),
            ]);
        }

        if ($this->filled('coupon_code')) {
            $this->merge([
                'coupon_code' => strtoupper(trim((string) $this->input('coupon_code'))),
            ]);
        }
    }
}

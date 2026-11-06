<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAddMoneyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'payment_method_id' => [
                'required',
                'integer',
                Rule::exists('payment_methods', 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
            'amount' => ['required', 'numeric', 'min:10'],
            'sender_number' => ['required', 'regex:/^01[3-9]\d{8}$/'],
            'trx_id' => ['required', 'string', 'min:6', 'max:40'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('trx_id')) {
            $this->merge([
                'trx_id' => strtoupper(trim((string) $this->input('trx_id'))),
            ]);
        }
    }
}

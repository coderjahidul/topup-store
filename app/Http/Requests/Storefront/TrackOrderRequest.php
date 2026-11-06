<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;

class TrackOrderRequest extends FormRequest
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
        return [
            'order_number' => ['required', 'string', 'max:40'],
            'phone' => ['required', 'regex:/^01[3-9]\d{8}$/'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('order_number')) {
            $this->merge([
                'order_number' => strtoupper(trim((string) $this->input('order_number'))),
            ]);
        }
    }
}

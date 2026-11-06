<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('catalog.manage') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        if ($this->has('is_active') && ! $this->filled('name_bn') && ! $this->filled('name_en')) {
            return [
                'is_active' => ['required', 'boolean'],
            ];
        }

        $gameId = $this->route('game')?->id;

        return [
            'name_bn' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::unique('games', 'slug')->ignore($gameId)],
            'uid_label_bn' => ['nullable', 'string', 'max:255'],
            'uid_label_en' => ['nullable', 'string', 'max:255'],
            'description_bn' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'requires_server' => ['sometimes', 'boolean'],
            'servers' => ['nullable'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}

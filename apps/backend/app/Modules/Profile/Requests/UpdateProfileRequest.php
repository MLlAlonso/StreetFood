<?php

namespace App\Modules\Profile\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255',],
            'email' => [
                'required', 'email',
                Rule::unique('users')->ignore($this->user()->id),
            ],
            'phone' => ['nullable', 'string', 'max:20',],
            'language' => ['required', 'in:en,es',],
            'avatar' => ['nullable', 'string',],
        ];
    }
}
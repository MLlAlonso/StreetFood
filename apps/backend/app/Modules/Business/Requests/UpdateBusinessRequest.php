<?php

namespace App\Modules\Business\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_type' => ['required', 'in:food_truck,restaurant',],
            'business_name' => ['required', 'string', 'max:255',],
            'logo' => ['nullable', 'string',],
            'description' => ['nullable', 'string',],
            'latitude' => ['nullable', 'numeric',],
            'longitude' => [ 'nullable', 'numeric', ],
            'categories' => ['required', 'array', 'min:1', 'max:3',],
            'categories.*' => ['string',],
            'menu' => ['nullable', 'array',],
            'menu.*.name' => ['required', 'string',],
            'menu.*.description' => ['nullable', 'string',],
            'menu.*.image' => ['nullable', 'string',],
        ];
    }
}

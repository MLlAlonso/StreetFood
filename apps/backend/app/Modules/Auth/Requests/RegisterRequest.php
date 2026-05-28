<?php

namespace App\Modules\Auth\Requests;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',

            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*\d).+$/',
                'confirmed',
            ],

            'role' => 'required|in:customer,vendor',
            'language' => 'required|in:en,es',

            // Vendor only
            'business_type' => [
                'nullable',
                'required_if:role,vendor',
                'in:food_truck,restaurant',
            ],

            'business_name' => [
                'nullable',
                'required_if:role,vendor',
                'string',
                'max:255',
            ],

            'logo' => 'nullable|string',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'categories' => 'nullable|array',
            'categories.*' => 'string',
        ];
    }
}
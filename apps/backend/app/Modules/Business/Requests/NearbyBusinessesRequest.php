<?php

namespace App\Modules\Business\Requests;
use Illuminate\Foundation\Http\FormRequest;

class NearbyBusinessesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90',],
            'longitude' => ['required', 'numeric', 'between:-180,180',],
            'radius_km' => ['sometimes', 'numeric', 'gt:0', 'max:100',],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100',],
        ];
    }
}
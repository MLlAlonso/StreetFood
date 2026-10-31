<?php

namespace App\Modules\Business\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BusinessDirectionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'origin_latitude' => ['required', 'numeric', 'between:-90,90',],
            'origin_longitude' => ['required', 'numeric', 'between:-180,180',],
        ];
    }
}
<?php

namespace App\Modules\Reviews\Requests;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_id' => ['required', 'exists:businesses,id',],
            'rating' => ['required', 'integer', 'min:1', 'max:5',],
            'comment' => ['required', 'string', 'min:5', 'max:1000',],
        ];
    }
}
<?php

namespace App\Modules\Business\Requests;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'in:open,closed',
            ],
        ];
    }
}
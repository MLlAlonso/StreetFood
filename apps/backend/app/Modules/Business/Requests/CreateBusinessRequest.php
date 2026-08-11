<?php

namespace App\Modules\Business\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBusinessRequest extends FormRequest
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
            'longitude' => ['nullable', 'numeric',],
            'categories' => ['required', 'array', 'min:1', 'max:3',],
            'categories.*' => ['string',],
            'menu' => ['nullable', 'array',],
            'menu.*.name' => ['required', 'string',],
            'menu.*.description' => ['nullable', 'string',],
            'menu.*.image' => ['nullable', 'string',],
            'schedule_enabled' => ['required', 'boolean',],
            'hours' => ['required', 'array', 'size:7',],
            'hours.*.day_of_week' => ['required', 'integer', 'between:0,6',],
            'hours.*.enabled' => ['required', 'boolean',],
            'hours.*.open_time' => ['nullable', 'date_format:H:i',],
            'hours.*.close_time' => ['nullable', 'date_format:H:i',],
            'social_links' => ['nullable', 'array', 'max:3'],
            'social_links.*.type' => ['required_with:social_links', 'in:website,instagram,whatsapp,uber_eats,rappi,didi_food,facebook',],
            'social_links.*.url' => ['required_with:social_links', 'string', 'max:255',],
        ];
    }
}
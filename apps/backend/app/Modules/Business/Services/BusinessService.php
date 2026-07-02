<?php

namespace App\Modules\Business\Services;

use App\Models\Business;
use App\Modules\Shared\Responses\ApiResponse;

class BusinessService
{
    public function index()
    {
        $businesses = Business::with(['categories', 'menuItems'])->get();

        $data = $businesses->map(
            function ($business) {
                return [
                    'id' => $business->id,
                    'business_name' => $business->business_name,
                    'business_type' => $business->business_type,
                    'logo' => $business->logo,
                    'image' => $business
                        ->menuItems
                        ->first()?->image
                        ??
                        $business->logo,

                    'categories' => $business
                        ->categories
                        ->pluck('name')
                        ->values(),

                    'rating' => 0,
                    'distance' => 0,
                ];
            }
        );

        return ApiResponse::success('Businesses retrieved', $data);
    }

    public function show(int $id)
    {
        $business = Business::with([
            'user',
            'categories',
            'menuItems',
        ])->findOrFail($id);

        return ApiResponse::success(
            'Business retrieved',
            [
                'id' => $business->id,
                'business_name' => $business->business_name,
                'business_type' => $business->business_type,
                'logo' => $business->logo,

                'image' => $business
                    ->menuItems
                    ->first()?->image
                    ??
                    $business->logo,

                'description' => $business->description,
                'latitude' => $business->latitude,
                'longitude' => $business->longitude,
                'rating' => 0,
                'distance' => 0,

                'owner' => [
                    'id' => $business->user->id,
                    'name' => $business->user->name,
                    'email' => $business->user->email,
                    'phone' => $business->user->phone,
                    'language' => $business->user->language,
                    'avatar' => $business->user->avatar,
                ],

                'categories' => $business
                    ->categories
                    ->pluck('name')
                    ->values(),

                'menu' => $business
                    ->menuItems
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'description' => $item->description,
                            'image' => $item->image,
                        ];
                    }),
            ]
        );
    }
}
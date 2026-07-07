<?php

namespace App\Modules\Favorites\Services;

use App\Models\Favorite;
use App\Models\User;
use App\Models\Business;
use App\Modules\Shared\Responses\ApiResponse;

class FavoritesService
{
    public function index(User $user)
    {
        $favorites = Favorite::with(['business.categories', 'business.menuItems',])
            ->where('user_id', $user->id)
            ->get();

        $data = $favorites->map(function ($favorite) {
            $business = $favorite->business;

            return [
                'id' => $business->id,
                'business_name' => $business->business_name,
                'business_type' => $business->business_type,
                'logo' => $business->logo,
                'image' => $business->menuItems->first()?->image ?? $business->logo,

                'categories' => $business->categories
                    ->pluck('name')
                    ->values(),

                'rating' => 0,
                'distance' => 0,
            ];
        });

        return ApiResponse::success(
            'Favorites retrieved',
            $data
        );
    }

    public function store(User $user, int $businessId)
    {
        Business::findOrFail($businessId);

        Favorite::firstOrCreate([
            'user_id' => $user->id,
            'business_id' => $businessId,
        ]);

        return ApiResponse::success(
            'Favorite added'
        );
    }

    public function destroy(User $user, int $businessId)
    {
        Favorite::where([
            'user_id' => $user->id,
            'business_id' => $businessId,
        ])->delete();

        return ApiResponse::success(
            'Favorite removed'
        );
    }

    public function status(User $user, int $businessId)
    {
        $favorite = Favorite::where([
            'user_id' => $user->id,
            'business_id' => $businessId,
        ])->exists();

        return ApiResponse::success(
            'Favorite status',
            ['favorite' => $favorite,]
        );
    }
}
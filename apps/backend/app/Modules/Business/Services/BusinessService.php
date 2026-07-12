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
                    'image' => $business->menuItems
                        ->first()?->image ?? $business->logo,

                    'categories' => $business->categories
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
            'reviews.user',
        ])->findOrFail($id);

        $rating = round(
            $business->reviews->avg('rating') ?? 0,
            1
        );

        $totalReviews = $business->reviews->count();
        $latestReviews = $business->reviews
            ->sortByDesc('created_at')
            ->take(3)
            ->values();

        return ApiResponse::success(
            'Business retrieved',
            [
                'id' => $business->id,
                'business_name' => $business->business_name,
                'business_type' => $business->business_type,
                'logo' => $business->logo,

                'image' => $business->menuItems
                    ->first()?->image ?? $business->logo,

                'description' => $business->description,
                'latitude' => $business->latitude,
                'longitude' => $business->longitude,
                'rating' => $rating,
                'reviews_count' => $totalReviews,
                'distance' => 0,

                'owner' => [
                    'id' => $business->user->id,
                    'name' => $business->user->name,
                    'email' => $business->user->email,
                    'phone' => $business->user->phone,
                    'language' => $business->user->language,
                    'avatar' => $business->user->avatar,
                ],

                'categories' => $business->categories
                    ->pluck('name')
                    ->values(),

                'menu' => $business->menuItems
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'description' => $item->description,
                            'image' => $item->image,
                        ];
                    }),

                'reviews' => $latestReviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'created_at' => $review->created_at,

                        'user' => [
                            'id' => $review->user->id,
                            'name' => $review->user->name,
                            'avatar' => $review->user->avatar,
                        ],
                    ];
                }),
            ]
        );
    }

    public function reviews(int $id)
    {

        $business = Business::findOrFail($id);

        $reviews = $business
            ->reviews()
            ->with('user')
            ->latest()
            ->paginate(10);

        $reviews->through(
            function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at,

                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'avatar' => $review->user->avatar,
                    ],
                ];
            }
        );

        return ApiResponse::success(
            'Reviews retrieved.', $reviews
        );
    }
}
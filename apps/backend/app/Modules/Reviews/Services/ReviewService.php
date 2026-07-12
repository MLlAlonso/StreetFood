<?php

namespace App\Modules\Reviews\Services;

use App\Models\Business;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReviewReceivedMail;
use App\Modules\Shared\Responses\ApiResponse;

class ReviewService
{
    public function store(User $user, array $data)
    {
        $business = Business::with('user')->findOrFail($data['business_id']);

        /* El dueño no puede calificarse. */
        if ($business->user_id === $user->id) {
            return ApiResponse::error(
                'You cannot review your own business.',
                null,
                403
            );
        }

        /* Si ya existe review... la actualizamos. */
        $review = Review::updateOrCreate(
            [
                'user_id' => $user->id,
                'business_id' => $business->id,
            ],

            [
                'rating' => $data['rating'],
                'comment' => $data['comment'],
            ]
        );

        if ($review->wasRecentlyCreated) {
            Mail::to($business->user->email)->send(
                new ReviewReceivedMail(
                    businessName: $business->business_name,
                    reviewerName: $user->name,
                    rating: $review->rating,
                    comment: $review->comment,
                )
            );
        }

        return ApiResponse::success(
            'Review saved successfully.',
            $review
        );
    }
}
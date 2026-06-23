<?php

namespace App\Modules\Business\Services;

use App\Models\Business;
use App\Modules\Shared\Responses\ApiResponse;

class BusinessService
{
    public function index()
    {
        $businesses = Business::with(['categories', 'menuItems'])->get();

        $data =
            $businesses->map(
                function ($business) {

                    return [
                        'id' => $business->id,
                        'business_name' => $business->business_name,
                        'business_type' => $business->business_type,
                        'logo' => $business->logo,

                        'categories' => $business -> categories
                            ->pluck('name')
                            ->values(),

                        'rating' => 0,
                        'distance' => 0,
                    ];
                }
            );

        return ApiResponse::success( 'Businesses retrieved', $data);
    }
}
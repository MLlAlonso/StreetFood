<?php

namespace App\Modules\Business\Services;

use App\Models\Business;
use App\Models\BusinessLiveLocation;
use App\Models\User;
use App\Modules\Shared\Responses\ApiResponse;
use Illuminate\Support\Facades\DB;

class BusinessLiveLocationService
{

    public function start(User $user, int $id, array $data)
    {
        $business = $user->business()->findOrFail($id);

        $location = BusinessLiveLocation::updateOrCreate(
            ['business_id' => $business->id],
            [
                'active' => true,
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'updated_at' => now(),
            ]
        );

        return ApiResponse::success('Live location enabled.', $this->formatLocation($location));
    }

    public function update(User $user, int $id, array $data)
    {
        $business = $user->business()->findOrFail($id);
        $location = $business->liveLocation;

        if (!$location || !$location->active) {
            return ApiResponse::error('Live location is not enabled.', null, 409);
        }

        $location->update([
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'updated_at' => now(),
        ]);

        return ApiResponse::success('Live location updated.', $this->formatLocation($location->fresh()));
    }

    public function stop(User $user, int $id)
    {
        $business = $user->business()->findOrFail($id);

        BusinessLiveLocation::query()
            ->where('business_id', $business->id)
            ->update(['active' => false, 'latitude' => null, 'longitude' => null, 'updated_at' => null,]);

        return ApiResponse::success('Live location disabled.',  ['business_id' => $business->id, 'active' => false,]);
    }

    public function show(int $id)
    {
        $business = Business::query()->findOrFail($id);
        $location = $business->liveLocation;
        $isFresh = $location && $location->updated_at && $location->updated_at->greaterThanOrEqualTo(now()->subMinutes(2));
        $available = $location && $location->active && $isFresh  && $location->latitude !== null  && $location->longitude !== null;

        return ApiResponse::success(
            'Live location retrieved.',
            [
                'business_id' => $business->id,
                'active' => (bool) ($location?->active ?? false),
                'available' => (bool) $available,
                'latitude' => $available ? (float) $location->latitude : null,
                'longitude' => $available ? (float) $location->longitude : null,
                'updated_at' => $available ? $location->updated_at->toIso8601String() : null,
            ]
        );
    }

    private function formatLocation(BusinessLiveLocation $location): array
    {
        return [
            'business_id' => $location->business_id,
            'active' => $location->active,
            'latitude' => $location->latitude,
            'longitude' => $location->longitude,
            'updated_at' => $location->updated_at?->toIso8601String(),
        ];
    }
}

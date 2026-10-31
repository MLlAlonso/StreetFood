<?php

namespace App\Modules\Business\Services;

use App\Models\Business;
use App\Modules\Business\Services\BusinessStatusService;
use App\Support\ApiResponse;

class NearbyBusinessService
{
    public function __construct(protected BusinessStatusService $statusService) {}

    public function index(array $filters)
    {
        $latitude = (float) $filters['latitude'];
        $longitude = (float) $filters['longitude'];
        $radius = (float) ($filters['radius_km'] ?? 10);
        $limit = (int) ($filters['limit'] ?? 50);

        $businesses = Business::query()
            ->with(['menuItems', 'reviews', 'hours', 'socialLinks', 'liveLocation',])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();

        $results = $businesses->map(function ($business) use ($latitude, $longitude) {

            $liveLocation = $business->liveLocation;
            $hasValidLiveCoordinates =
                $liveLocation !== null &&
                $liveLocation->latitude !== null &&
                $liveLocation->longitude !== null &&
                is_numeric($liveLocation->latitude) &&
                is_numeric($liveLocation->longitude) &&
                $liveLocation->latitude >= -90 &&
                $liveLocation->latitude <= 90 &&
                $liveLocation->longitude >= -180 &&
                $liveLocation->longitude <= 180;

            $liveLocationIsFresh =
                $liveLocation !== null &&
                $liveLocation->updated_at !== null &&
                $liveLocation->updated_at->greaterThanOrEqualTo(
                    now()->subMinutes(2)
                );

            $useLiveLocation = $liveLocation !== null && $liveLocation->active && $hasValidLiveCoordinates && $liveLocationIsFresh;
            $businessLatitude = $useLiveLocation ? (float) $liveLocation->latitude : (float) $business->latitude;
            $businessLongitude = $useLiveLocation ? (float) $liveLocation->longitude : (float) $business->longitude;

            // Calcular distancia usando la ubicación seleccionada.
            $distance = $this->distanceKm($latitude, $longitude, $businessLatitude, $businessLongitude);
            $status = $this->statusService->resolve($business);

            return [
                'id' => $business->id,
                'business_name' => $business->business_name,
                'business_type' => $business->business_type,
                'logo' => $business->logo,
                'image' => $business->menuItems->first()?->image ?? $business->logo,
                'categories' => $business->categories ?? [],
                'latitude' => $businessLatitude,
                'longitude' => $businessLongitude,
                'distance' => round($distance, 2),
                'rating' => round($business->reviews->avg('rating') ?? 0, 1),
                'reviews_count' => $business->reviews->count(),
                'status' => $status['status'],
                'status_reason' => $status['reason'],
                'opens_at' => optional($status['opens_at'])->format('H:i'),
                'closes_at' => optional($status['closes_at'])->format('H:i'),
                'live_location_enabled' => (bool) ($liveLocation?->active ?? false),
                'social_links' => $business->socialLinks->map(fn($link) => ['type' => $link->type, 'url' => $link->url,])->values(),
            ];
        })
            ->filter(fn($business) => $business['distance'] <= $radius)
            ->sortBy('distance')
            ->take($limit)
            ->values();

        return ApiResponse::success('Nearby businesses retrieved.', [
            'origin' => ['latitude' => $latitude, 'longitude' => $longitude,],
            'radius_km' => $radius,
            'count' => $results->count(),
            'businesses' => $results,
        ]);
    }

    private function distanceKm(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371;
        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);
        $a = sin($latDelta / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($lonDelta / 2) ** 2;
        $a = min(1, max(0, $a));
        return $earthRadius * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}

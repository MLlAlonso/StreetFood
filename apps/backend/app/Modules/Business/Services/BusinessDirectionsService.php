<?php

namespace App\Modules\Business\Services;

use App\Models\Business;
use App\Modules\Shared\Responses\ApiResponse;
use Illuminate\Support\Facades\Http;

class BusinessDirectionsService
{
    public function calculate(int $id, array $data)
    {
        $business = Business::query()->with('liveLocation')->findOrFail($id);
        $live = $business->liveLocation;

        $liveIsAvailable = $live && $live->active  && $live->latitude !== null && $live->longitude !== null
            && $live->updated_at && $live->updated_at->greaterThanOrEqualTo(now()->subMinutes(2));

        $destinationLatitude = $liveIsAvailable ? (float) $live->latitude : $business->latitude;
        $destinationLongitude = $liveIsAvailable ? (float) $live->longitude : $business->longitude;

        if ($destinationLatitude === null || $destinationLongitude === null) {
            return ApiResponse::error('Business location is unavailable.',  null,  422);
        }

        $key = config('services.google_maps.key');

        if (!$key) {
            return ApiResponse::error('Routing service is not configured.', null, 503);
        }

        $response = Http::timeout(15)
            ->withHeaders([
                'X-Goog-Api-Key' => $key,
                'X-Goog-FieldMask' =>
                'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
            ])
            ->post(
                'https://routes.googleapis.com/directions/v2:computeRoutes',
                [
                    'origin' => [
                        'location' => [
                            'latLng' => [
                                'latitude' => (float) $data['origin_latitude'],
                                'longitude' => (float) $data['origin_longitude'],
                            ],
                        ],
                    ],
                    'destination' => [
                        'location' => [
                            'latLng' => [
                                'latitude' => (float) $destinationLatitude,
                                'longitude' => (float) $destinationLongitude,
                            ],
                        ],
                    ],
                    'travelMode' => 'DRIVE',
                    'computeAlternativeRoutes' => false,
                    'languageCode' => 'es-MX',
                    'units' => 'METRIC',
                ]
            );

        if (!$response->successful()) {
            report(new \RuntimeException('Google Routes API failed: HTTP ' . $response->status()));
            return ApiResponse::error('Unable to calculate the route.', null, 502);
        }

        $route = $response->json('routes.0');

        if (!$route || empty($route['polyline']['encodedPolyline'])) {
            return ApiResponse::error('No route was found.', null, 404);
        }

        return ApiResponse::success(
            'Route calculated.',
            [
                'business_id' => $business->id,
                'destination_type' => $liveIsAvailable ? 'live' : 'permanent',
                'origin' => [
                    'latitude' => (float) $data['origin_latitude'],
                    'longitude' => (float) $data['origin_longitude'],
                ],
                'destination' => [
                    'latitude' => (float) $destinationLatitude,
                    'longitude' => (float) $destinationLongitude,
                ],
                'distance_meters' => $route['distanceMeters'] ?? null,
                'duration' => $route['duration'] ?? null,
                'encoded_polyline' =>
                $route['polyline']['encodedPolyline'],
            ]
        );
    }
}
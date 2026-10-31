<?php

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Modules\Business\Services\BusinessService;
use App\Modules\Business\Services\BusinessLiveLocationService;
use App\Modules\Business\Services\NearbyBusinessService;
use App\Modules\Business\Services\BusinessDirectionsService;
use App\Modules\Business\Requests\CreateBusinessRequest;
use App\Modules\Business\Requests\UpdateBusinessRequest;
use App\Modules\Business\Requests\UpdateBusinessStatusRequest;
use App\Modules\Business\Requests\UpdateLiveLocationRequest;
use App\Modules\Business\Requests\NearbyBusinessesRequest;
use App\Modules\Business\Requests\BusinessDirectionsRequest;

class BusinessController extends Controller
{
    public function __construct(
        protected BusinessService $service,
        protected BusinessLiveLocationService $liveLocationService,
        protected NearbyBusinessService $nearbyBusinessService,
        protected BusinessDirectionsService $directionsService
    ) {}

    /*
    |--------------------------------------------------------------------------
    | Public endpoints
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        return $this->service->index();
    }

    public function nearby(NearbyBusinessesRequest $request)
    {
        return $this->nearbyBusinessService->index($request->validated());
    }

    public function show(int $id)
    {
        return $this->service->show($id);
    }

    public function reviews(int $id)
    {
        return $this->service->reviews($id);
    }

    public function liveLocation(int $id)
    {
        return $this->liveLocationService->show($id);
    }

    public function directions(BusinessDirectionsRequest $request, int $id)
    {
        return $this->directionsService->calculate($id, $request->validated());
    }

    /*
    |--------------------------------------------------------------------------
    | Authenticated endpoints
    |--------------------------------------------------------------------------
    */
    public function my(Request $request)
    {
        return $this->service->my(
            $request->user()
        );
    }

    public function store(CreateBusinessRequest $request)
    {
        return $this->service->store($request->user(), $request->validated());
    }

    public function update(UpdateBusinessRequest $request, int $id)
    {
        return $this->service->update($request->user(), $id, $request->validated());
    }

    public function destroy(Request $request, int $id)
    {
        return $this->service->destroy($request->user(), $id);
    }

    public function updateStatus(UpdateBusinessStatusRequest $request, int $id)
    {
        return $this->service->updateStatus($request->user(),  $id,  $request->validated());
    }

    /*
    |--------------------------------------------------------------------------
    | Business live location
    |--------------------------------------------------------------------------
    */
    public function startLiveLocation(UpdateLiveLocationRequest $request, int $id)
    {
        return $this->liveLocationService->start($request->user(), $id, $request->validated());
    }

    public function updateLiveLocation(UpdateLiveLocationRequest $request, int $id)
    {
        return $this->liveLocationService->update($request->user(), $id, $request->validated());
    }

    public function stopLiveLocation(Request $request, int $id)
    {
        return $this->liveLocationService->stop($request->user(), $id);
    }

    public function reverseGeocode(Request $request)
    {
        $validated = $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $apiKey = config('services.google_maps.key');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'Google Maps API key is not configured.',
            ], 500);
        }

        try {
            $response = Http::timeout(15)->get(
                'https://maps.googleapis.com/maps/api/geocode/json',
                [
                    'latlng' => $validated['latitude'] . ',' . $validated['longitude'],
                    'key' => $apiKey,
                    'language' => 'es',
                    'region' => 'mx',
                ]
            );

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to retrieve the selected address.',
                ], 502);
            }

            $data = $response->json();

            if (($data['status'] ?? null) !== 'OK' || empty($data['results'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'No address was found for the selected location.',
                    'google_status' => $data['status'] ?? 'UNKNOWN_ERROR',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [ 'formatted_address' => $data['results'][0]['formatted_address'], ],
            ]);
        } catch (\Throwable $exception) {
            Log::error('Business reverse geocoding failed', [ 'message' => $exception->getMessage(), ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving the address.',
            ], 500);
        }
    }
}

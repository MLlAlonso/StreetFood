<?php

namespace App\Modules\Business\Services;

use App\Models\Business;
use App\Models\User;
use App\Models\Category;
use App\Modules\Shared\Responses\ApiResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Modules\Business\Services\BusinessStatusService;

class BusinessService
{
    public function index()
    {
        $businesses = Business::with(['categories', 'menuItems', 'reviews', 'hours',])->get();

        $data = $businesses->map(
            function ($business) {
                $status = $this->statusService->resolve($business);
                $rating = round($business->reviews->avg('rating') ?? 0, 1);

                return [
                    'id' => $business->id,
                    'business_name' => $business->business_name,
                    'business_type' => $business->business_type,
                    'logo' => $business->logo,
                    'image' => $business->menuItems->first()?->image ?? $business->logo,
                    'categories' => $business->categories->pluck('name')->values(),
                    'rating' => $rating,
                    'reviews_count' => $business->reviews->count(),
                    'distance' => 0,
                    'status' => $status['status'],
                    'status_reason' => $status['reason'],
                    'opens_at' => optional($status['opens_at'])->format('H:i'),
                    'closes_at' => optional($status['closes_at'])->format('H:i'),
                ];
            }
        );

        return ApiResponse::success('Businesses retrieved', $data);
    }

    public function show(int $id)
    {
        $business = Business::with(['user', 'categories', 'menuItems', 'reviews.user', 'hours',])->findOrFail($id);

        $status = $this->statusService->resolve($business);
        $rating = round($business->reviews->avg('rating') ?? 0, 1);
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
                'image' => $business->menuItems->first()?->image ?? $business->logo,
                'description' => $business->description,
                'latitude' => $business->latitude,
                'longitude' => $business->longitude,
                'rating' => $rating,
                'reviews_count' => $totalReviews,
                'distance' => 0,
                'status' => $status['status'],
                'status_reason' => $status['reason'],
                'opens_at' => optional($status['opens_at'])->format('H:i'),
                'closes_at' => optional($status['closes_at'])->format('H:i'),
                'schedule_enabled' => $business->schedule_enabled,
                'hours' => $business->hours->sortBy('day_of_week')->values(),

                'owner' => [
                    'id' => $business->user->id,
                    'name' => $business->user->name,
                    'email' => $business->user->email,
                    'phone' => $business->user->phone,
                    'language' => $business->user->language,
                    'avatar' => $business->user->avatar,
                ],

                'categories' => $business->categories->pluck('name')->values(),

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

        $reviews = $reviews->through(
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
            'Reviews retrieved.',
            $reviews
        );
    }

    public function my(User $user)
    {
        $businesses = $user
            ->business()
            ->with(['categories', 'menuItems', 'reviews', 'hours',])
            ->get();

        return ApiResponse::success(
            'Businesses retrieved',
            $businesses->map(
                function ($business) {
                    $status = $this->statusService->resolve($business);
                    $rating = round($business->reviews->avg('rating') ?? 0, 1);

                    return [
                        'id' => $business->id,
                        'business_name' => $business->business_name,
                        'business_type' => $business->business_type,
                        'logo' => $business->logo,
                        'image' => $business->menuItems->first()?->image ?? $business->logo,
                        'categories' => $business->categories->pluck('name')->values(),
                        'rating' => $rating,
                        'reviews_count' => $business->reviews->count(),
                        'distance' => 0,
                        'status' => $status['status'],
                        'status_reason' => $status['reason'],
                        'opens_at' => optional($status['opens_at'])->format('H:i'),
                        'closes_at' => optional($status['closes_at'])->format('H:i'),
                    ];
                }
            )
        );
    }

    public function store(User $user, array $data)
    {
        if ($user->business()->count() >= 5) {
            return ApiResponse::error(
                'Maximum number of businesses reached.',
                null,
                422
            );
        }

        $business = null;

        DB::transaction(function () use ($user, $data, &$business) {
            $business = $user->business()->create([
                'business_type' => $data['business_type'],
                'business_name' => $data['business_name'],
                'logo' => $data['logo'] ?? null,
                'description' => $data['description'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'schedule_enabled' => $data['schedule_enabled'],
                'manual_override' => 'none',
            ]);

            if (!empty($data['categories'])) {
                $ids = Category::whereIn('name', $data['categories'])->pluck('id');
                $business->categories()->sync($ids);
            }

            if (!empty($data['menu'])) {
                foreach ($data['menu'] as $dish) {
                    $business->menuItems()->create([
                        'name' => $dish['name'],
                        'description' => $dish['description'] ?? null,
                        'image' => $dish['image'] ?? null,
                    ]);
                }
            }

            $this->syncBusinessHours($business, $data['hours']);
        });
    }

    public function update(User $user, int $id, array $data)
    {
        $business = $user->business()->findOrFail($id);

        DB::transaction(function () use ($business, $data) {
            $business->update([
                'business_type' => $data['business_type'],
                'business_name' => $data['business_name'],
                'logo' => $data['logo'] ?? null,
                'description' => $data['description'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'schedule_enabled' => $data['schedule_enabled'],
            ]);

            if ($data['schedule_enabled']) {
                $business->update(['manual_override' => 'none',]);
            }

            $ids = Category::whereIn('name', $data['categories'])->pluck('id');
            $business->categories()->sync($ids);
            $business->menuItems()->delete();

            foreach ($data['menu'] ?? [] as $dish) {
                $business->menuItems()->create([
                    'name' => $dish['name'],
                    'description' => $dish['description'] ?? null,
                    'image' => $dish['image'] ?? null,
                ]);
            }

            $this->syncBusinessHours($business, $data['hours']);
        });

        return ApiResponse::success(
            'Business updated.',
            $business->load('categories', 'menuItems')
        );
    }

    public function updateStatus(User $user, int $id, array $data)
    {
        $business = $user->business()->with('hours')->findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | Modo manual
        |--------------------------------------------------------------------------
        */
        if (!$business->schedule_enabled) {
            $business->update([
                'manual_override' => $data['status'],
                'manual_override_until' => null,
            ]);

            return ApiResponse::success(
                'Business status updated.', [ 'status' => $data['status'], ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Modo horario
        |--------------------------------------------------------------------------
        */
        $today = now()->dayOfWeek;
        $hours = $business->hours->firstWhere( 'day_of_week', $today );

        if (!$hours || !$hours->enabled) {
            return ApiResponse::error(
                'Business is closed today.', null, 422
            );
        }

        $open = Carbon::parse($hours->open_time);
        $close = Carbon::parse($hours->close_time);
        $now = now();

        /*
        |--------------------------------------------------------------------------
        | Abrir ahora
        |--------------------------------------------------------------------------
        */
        if ($data['status'] === 'open') {
            if ($now->gte($close)) {
                return ApiResponse::error(
                    'Business cannot be opened after closing time.', null, 422
                );
            }

            $business->update([
                'manual_override' => 'open',
                'manual_override_until' => $open,
            ]);

            return ApiResponse::success(
                'Business opened.', [ 'status' => 'open', ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Cerrar ahora
        |--------------------------------------------------------------------------
        */
        $business->update([
            'manual_override' => 'closed',
            'manual_override_until' => $close,
        ]);

        return ApiResponse::success( 'Business closed.', [ 'status' => 'closed', ] );
    }
    public function destroy(User $user, int $id)
    {
        $business = $user->business()->findOrFail($id);
        $business->delete();

        return ApiResponse::success('Business deleted.');
    }

    public function __construct(
        protected BusinessStatusService $statusService,
    ) {}

    private function syncBusinessHours(Business $business, array $hours): void
    {
        $business->hours()->delete();

        foreach ($hours as $hour) {
            $business->hours()->create([
                'day_of_week' => $hour['day_of_week'],
                'enabled' => $hour['enabled'],
                'open_time' => $hour['enabled'] ? $hour['open_time'] : null,
                'close_time' => $hour['enabled'] ? $hour['close_time'] : null,
            ]);
        }
    }
}

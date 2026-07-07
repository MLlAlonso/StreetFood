<?php

namespace App\Modules\Favorites\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Favorites\Services\FavoritesService;
use Illuminate\Http\Request;

class FavoritesController extends Controller
{
    public function __construct(protected FavoritesService $service) {}

    public function index(Request $request)
    {
        return $this->service->index(
            $request->user()
        );
    }

    public function store(Request $request, int $business)
    {
        return $this->service->store(
            $request->user(),
            $business
        );
    }

    public function destroy(Request $request, int $business)
    {
        return $this->service->destroy(
            $request->user(),
            $business
        );
    }

    public function status(Request $request, int $business)
    {
        return $this->service->status(
            $request->user(),
            $business
        );
    }
}
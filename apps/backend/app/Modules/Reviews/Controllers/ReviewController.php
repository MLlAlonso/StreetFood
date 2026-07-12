<?php

namespace App\Modules\Reviews\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Reviews\Requests\StoreReviewRequest;
use App\Modules\Reviews\Services\ReviewService;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(protected ReviewService $service) {}

    public function store(StoreReviewRequest $request)
    {
        return $this->service->store(
            $request->user(),
            $request->validated()
        );
    }
}
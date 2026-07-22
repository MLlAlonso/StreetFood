<?php

namespace App\Modules\Profile\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Profile\Requests\UpdateProfileRequest;
use App\Modules\Profile\Services\ProfileService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(protected ProfileService $profileService) {}

    public function show(Request $request)
    {
        return $this->profileService->show($request->user());
    }

    public function update(UpdateProfileRequest $request)
    {
        return $this->profileService->update($request->user(), $request->validated());
    }
}

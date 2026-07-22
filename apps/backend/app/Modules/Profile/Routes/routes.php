<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Profile\Controllers\ProfileController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get( '/profile', [ProfileController::class, 'show'] );
    Route::put( '/profile', [ProfileController::class, 'update'] );
});
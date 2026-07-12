<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Reviews\Controllers\ReviewController;

Route::middleware('auth:sanctum')->prefix('reviews')->group(function () {
    Route::post('/', [ReviewController::class, 'store']);
});

<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Business\Controllers\BusinessController;

Route::prefix('businesses')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Authenticated
    |--------------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/my', [BusinessController::class, 'my']);
        Route::post('/', [BusinessController::class, 'store']);
        Route::put('/{id}', [BusinessController::class, 'update']);
        Route::delete('/{id}', [BusinessController::class, 'destroy']);
        Route::patch('/{id}/status', [BusinessController::class, 'updateStatus']);
    });

    /*
    |--------------------------------------------------------------------------
    | Public
    |--------------------------------------------------------------------------
    */
    Route::get('/', [BusinessController::class, 'index']);
    Route::get('/{id}', [BusinessController::class, 'show']);
    Route::get('/{id}/reviews', [BusinessController::class, 'reviews']);
});

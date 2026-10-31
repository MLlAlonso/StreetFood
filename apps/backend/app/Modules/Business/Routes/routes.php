<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Business\Controllers\BusinessController;

Route::prefix('businesses')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Public endpoints
    |--------------------------------------------------------------------------
    */
    Route::get('/nearby', [BusinessController::class, 'nearby',])->middleware('throttle:60,1');
    Route::get('/', [BusinessController::class, 'index',]);
    Route::get('/{id}/directions', [BusinessController::class, 'directions',])->whereNumber('id')->middleware('throttle:30,1');
    Route::get('/{id}/live-location', [BusinessController::class, 'liveLocation',])->whereNumber('id')->middleware('throttle:120,1');
    Route::get('/{id}/reviews', [BusinessController::class, 'reviews',])->whereNumber('id');
    Route::get('/{id}', [BusinessController::class, 'show',])->whereNumber('id');
    Route::get('/reverse-geocode', [BusinessController::class, 'reverseGeocode']) ->middleware('throttle:60,1');

    /*
    |--------------------------------------------------------------------------
    | Authenticated endpoints
    |--------------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/my', [BusinessController::class, 'my',]);
        Route::post('/', [BusinessController::class, 'store',]);
        Route::put('/{id}', [BusinessController::class, 'update',])->whereNumber('id');
        Route::delete('/{id}', [BusinessController::class, 'destroy',])->whereNumber('id');
        Route::patch('/{id}/status', [BusinessController::class, 'updateStatus',])->whereNumber('id');
        Route::post('/{id}/live-location', [BusinessController::class, 'startLiveLocation',])->whereNumber('id')->middleware('throttle:30,1');
        Route::put('/{id}/live-location', [BusinessController::class, 'updateLiveLocation',])->whereNumber('id')->middleware('throttle:60,1');
        Route::delete('/{id}/live-location', [BusinessController::class, 'stopLiveLocation',])->whereNumber('id')->middleware('throttle:30,1');
    });
});

<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Favorites\Controllers\FavoritesController;

Route::middleware('auth:sanctum')->prefix('favorites')->group(function () {
    Route::get('/', [FavoritesController::class, 'index']);
    Route::post('/{business}', [FavoritesController::class, 'store']);
    Route::delete('/{business}', [FavoritesController::class, 'destroy']);
    Route::get('/{business}/status', [FavoritesController::class, 'status']);
});

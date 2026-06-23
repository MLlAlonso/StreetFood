<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Business\Controllers\BusinessController;

Route::prefix('businesses')->group( function () {
        Route::get('/', [BusinessController::class, 'index']);
    }
);
<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/send-verification-code', [AuthController::class, 'sendVerificationCode']);
    Route::post('/verify-code', [AuthController::class, 'verifyCode']);

    Route::post( '/forgot-password', [ AuthController::class, 'forgotPassword' ] );
    Route::post( '/verify-reset-code', [ AuthController::class, 'verifyResetCode' ] );
    Route::post( '/reset-password', [ AuthController::class, 'resetPassword' ] );

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

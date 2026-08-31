<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'message' => 'StreetEats API is running',
            'database' => \Illuminate\Support\Facades\DB::connection()->getPdo()
                ? 'connected'
                : 'disconnected',
        ]);
    });

    require app_path('Modules/Auth/Routes/routes.php');
    require app_path('Modules/Business/Routes/routes.php');
    require app_path('Modules/Favorites/Routes/routes.php');
    require app_path('Modules/Reviews/Routes/routes.php');
    require app_path('Modules/Profile/Routes/routes.php');
});
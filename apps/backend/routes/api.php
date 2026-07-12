<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    require app_path('Modules/Auth/Routes/routes.php');
    require app_path('Modules/Business/Routes/routes.php');
    require app_path('Modules/Favorites/Routes/routes.php');
    require app_path('Modules/Reviews/Routes/routes.php');
});
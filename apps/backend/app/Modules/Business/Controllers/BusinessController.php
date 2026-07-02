<?php

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Business\Services\BusinessService;

class BusinessController extends Controller
{
    public function __construct(protected BusinessService $service) {}

    public function index()
    {
        return $this->service->index();
    }

    public function show(int $id)
    {
        return $this->service->show($id);
    }
}
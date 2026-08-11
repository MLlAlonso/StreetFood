<?php

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Business\Services\BusinessService;
use Illuminate\Http\Request;
use App\Modules\Business\Requests\CreateBusinessRequest;
use App\Modules\Business\Requests\UpdateBusinessRequest;
use App\Modules\Business\Requests\UpdateBusinessStatusRequest;

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

    public function reviews(int $id)
    {
        return $this->service->reviews($id);
    }

    public function my(Request $request)
    {
        return $this->service->my($request->user());
    }

    public function store(CreateBusinessRequest $request)
    {
        return $this->service->store(
            $request->user(),
            $request->validated()
        );
    }

    public function update(UpdateBusinessRequest $request, int $id)
    {
        return $this->service->update(
            $request->user(),
            $id,
            $request->validated()
        );
    }

    public function destroy(Request $request, int $id)
    {
        return $this->service->destroy(
            $request->user(),
            $id
        );
    }

    public function updateStatus(UpdateBusinessStatusRequest $request, int $id)
    {
        return $this->service->updateStatus(
            $request->user(),
            $id,
            $request->validated()
        );
    }
}

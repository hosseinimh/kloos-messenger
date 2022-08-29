<?php

namespace App\Http\Controllers;

use App\Constants\ErrorCode;
use App\Constants\StoragePath;
use App\Http\Requests\Service\IndexServicesRequest;
use App\Http\Requests\Service\SetParentServiceRequest;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Interfaces\ServiceRepositoryInterface;
use App\Models\Service;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class ServiceController extends Controller
{
    public function __construct(JsonResponse $response, private ServiceRepositoryInterface $repository)
    {
        parent::__construct($response);
    }

    public function index(IndexServicesRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate($request->parent_id, $request->_pn, $request->_pi));
    }

    public function getAll(): HttpJsonResponse
    {
        return $this->onItems($this->repository->all());
    }

    public function show(Service $service): HttpJsonResponse
    {
        return $this->onItem($service);
    }

    public function store(StoreServiceRequest $request): HttpJsonResponse
    {
        if (($service = $this->repository->store($request->parent_id, $request->title))) {
            return $this->onOk((new FileUploaderController(StoragePath::SERVICE_IMAGE))->uploadImage($service, $request, 'image', 'image'));
        }

        return $this->onError(['_error' => __('general.store_error'), '_errorCode' => ErrorCode::STORE_ERROR]);
    }

    public function update(Service $service, UpdateServiceRequest $request): HttpJsonResponse
    {
        if ($this->repository->update($service, $request->title)) {
            return $this->onOk((new FileUploaderController(StoragePath::SERVICE_IMAGE))->uploadImage($service, $request, 'image', 'image'));
        }

        return $this->onError(['_error' => __('general.update_error'), '_errorCode' => ErrorCode::UPDATE_ERROR]);
    }

    public function destroy(Service $service): HttpJsonResponse
    {
        return $this->onDelete($this->repository->delete($service));
    }

    public function setParent(Service $service, SetParentServiceRequest $request): HttpJsonResponse
    {
        return $this->onBoolean($this->repository->setParent($service, $request->parent_id));
    }

    public function upPriority(Service $service): HttpJsonResponse
    {
        return $this->onBoolean($this->repository->upPriority($service));
    }

    public function downPriority(Service $service): HttpJsonResponse
    {
        return $this->onBoolean($this->repository->downPriority($service));
    }
}

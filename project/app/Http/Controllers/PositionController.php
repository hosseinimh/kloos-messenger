<?php

namespace App\Http\Controllers;

use App\Http\Requests\Position\GetAllPositionsByParentId;
use App\Http\Requests\Position\IndexPositionRequest;
use App\Http\Requests\Position\SetParentPositionRequest;
use App\Http\Requests\Position\StorePositionRequest;
use App\Http\Requests\Position\UpdatePositionRequest;
use App\Interfaces\PositionRepositoryInterface;
use App\Models\Position;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class PositionController extends Controller
{
    public function __construct(JsonResponse $response, private PositionRepositoryInterface $repository)
    {
        parent::__construct($response);
    }

    public function index(IndexPositionRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate($request->parent_id, $request->_pn, $request->_pi));
    }

    public function getAllByParentId(GetAllPositionsByParentId $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->allByParentId($request->parent_id));
    }

    public function show(Position $position): HttpJsonResponse
    {
        return $this->onItem($position);
    }

    public function store(StorePositionRequest $request): HttpJsonResponse
    {
        return $this->onStore($this->repository->store($request->parent_id, $request->title));
    }

    public function update(Position $position, UpdatePositionRequest $request): HttpJsonResponse
    {
        return $this->onUpdate($this->repository->update($position, $request->title));
    }

    public function destroy(Position $position): HttpJsonResponse
    {
        return $this->onDelete($this->repository->delete($position));
    }

    public function setParent(Position $position, SetParentPositionRequest $request): HttpJsonResponse
    {
        return $this->onBoolean($this->repository->setParent($position, $request->parent_id));
    }

    public function upPriority(Position $position): HttpJsonResponse
    {
        return $this->onBoolean($this->repository->upPriority($position));
    }

    public function downPriority(Position $position): HttpJsonResponse
    {
        return $this->onBoolean($this->repository->downPriority($position));
    }
}

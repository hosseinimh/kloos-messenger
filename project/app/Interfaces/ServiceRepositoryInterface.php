<?php

namespace App\Interfaces;

use App\Models\Service;

interface ServiceRepositoryInterface
{
    public function get(int $serviceId): mixed;
    public function paginate(int $parentId, int $page, int $pageItems): mixed;
    public function all(): mixed;
    public function countAll(): int;
    public function store(int $parentId, string $title): mixed;
    public function update(Service $service, string $title): bool;
    public function delete(Service $service): bool;
    public function setParent(Service $service, int $parentId): bool;
    public function upPriority(Service $service): bool;
    public function downPriority(Service $service): bool;
    public function updatePriorities(int $parentId): bool;
}

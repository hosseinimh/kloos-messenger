<?php

namespace App\Interfaces;

use App\Models\Position;

interface PositionRepositoryInterface
{
    public function get(int $positionId): mixed;
    public function paginate(int $parentId, int $page, int $pageItems): mixed;
    public function all(): mixed;
    public function allByParentId(int $parentId): mixed;
    public function countAll(): int;
    public function store(int $parentId, string $title): mixed;
    public function update(Position $position, string $title): bool;
    public function delete(Position $position): bool;
    public function setParent(Position $position, int $parentId): bool;
    public function upPriority(Position $position): bool;
    public function downPriority(Position $position): bool;
}

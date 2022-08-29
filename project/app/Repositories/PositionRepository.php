<?php

namespace App\Repositories;

use App\Interfaces\PositionRepositoryInterface;
use App\Models\Position;

class PositionRepository extends Repository implements PositionRepositoryInterface
{
    public function get(int $id): mixed
    {
        return Position::where('id', $id)->first();
    }

    public function paginate(int $parentId, int $page, int $pageItems): mixed
    {
        return Position::where('parent_id', $parentId)->orderBy('priority', 'DESC')->orderBy('title', 'ASC')->orderBy('id', 'ASC')->get();
    }

    public function all(): mixed
    {
        return Position::orderBy('parent_id', 'ASC')->orderBy('priority', 'ASC')->orderBy('title', 'DESC')->orderBy('id', 'DESC')->get();
    }

    public function allByParentId(int $parentId): mixed
    {
        return Position::where('parent_id', $parentId)->orderBy('parent_id', 'ASC')->orderBy('priority', 'ASC')->orderBy('title', 'DESC')->orderBy('id', 'DESC')->get();
    }

    public function countAll(): int
    {
        return Position::count();
    }

    public function store(int $parentId, string $title): mixed
    {
        $data = [
            'parent_id' => $parentId,
            'title' => $title,
            'priority' => optional($this->maxPriority(0))->priority + 1
        ];

        $position = Position::create($data);

        return $position ? $position : null;
    }

    public function update(Position $position, string $title): bool
    {
        $data = [
            'title' => $title,
        ];

        return $position->update($data);
    }

    public function delete(Position $position): bool
    {
        $parentId = $position->parent_id;
        $result = $position->delete();

        $this->updatePriorities($parentId);

        return $result;
    }

    public function setParent(Position $position, int $parentId): bool
    {
        $data = [
            'parent_id' => $parentId,
            'priority' => optional($this->maxPriority($parentId))->priority + 1,
        ];
        $oldParentId = $position->parent_id;
        $updated = $position->update($data);

        if ($oldParentId !== $parentId) {
            $this->updatePriorities($oldParentId);
        }

        $this->updatePriorities($parentId);

        return $updated;
    }

    public function upPriority(Position $position): bool
    {
        if (($max = $this->maxPriority($position->parent_id)) && $max->id !== $position->id) {
            $data = ['priority' => $position->priority + 1];

            $position->update($data);
            $this->decrementPriorities($position->parent_id, $position->id, $position->priority);
            $this->updatePriorities($position->parent_id);

            return true;
        }

        return false;
    }

    public function downPriority(Position $position): bool
    {
        if (($min = $this->minPriority($position->parent_id)) && $min->id !== $position->id && $position->priority > 0) {
            $data = ['priority' => $position->priority - 1];

            $position->update($data);
            $this->incrementPriorities($position->parent_id, $position->id, $position->priority);
            $this->updatePriorities($position->parent_id);

            return true;
        }

        return false;
    }

    private function updatePriorities(int $parentId): bool
    {
        if ($positions = $this->allByParentId($parentId)) {
            $priority = 1;

            foreach ($positions as $position) {
                $data = ['priority' => $priority++];

                $position->update($data);
            }

            return true;
        }

        return false;
    }

    private function maxPriority(int $parentId)
    {
        return Position::where('parent_id', $parentId)->orderBy('priority', 'DESC')->orderBy('title', 'DESC')->orderBy('id', 'DESC')->first();
    }

    private function minPriority(int $parentId)
    {
        return Position::where('parent_id', $parentId)->orderBy('priority', 'ASC')->orderBy('title', 'DESC')->orderBy('id', 'DESC')->first();
    }

    private function incrementPriorities(int $parentId, int $exceptId, int $priority)
    {
        return Position::where('parent_id', $parentId)->where('id', '!=', $exceptId)->where('priority', $priority)->increment('priority');
    }

    private function decrementPriorities(int $parentId, int $exceptId, int $priority)
    {
        return Position::where('parent_id', $parentId)->where('id', '!=', $exceptId)->where('priority', $priority)->decrement('priority');
    }
}

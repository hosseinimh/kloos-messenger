<?php

namespace App\Repositories;

use App\Interfaces\ServiceRepositoryInterface;
use App\Models\Service;

class ServiceRepository extends Repository implements ServiceRepositoryInterface
{
    public function get(int $serviceId): mixed
    {
        return Service::where('id', $serviceId)->first();
    }

    public function paginate(int $parentId, int $page, int $pageItems): mixed
    {
        return Service::where('parent_id', $parentId)->orderBy('priority', 'DESC')->orderBy('title', 'ASC')->orderBy('id', 'ASC')->skip(($page - 1) * $pageItems)->take($pageItems)->get();
    }

    public function all(): mixed
    {
        return Service::orderBy('parent_id', 'ASC')->orderBy('priority', 'DESC')->orderBy('title', 'ASC')->orderBy('id', 'ASC')->get();
    }

    public function countAll(): int
    {
        return Service::count();
    }

    public function store(int $parentId, string $title): mixed
    {
        $data = [
            'parent_id' => $parentId,
            'title' => $title,
            'priority' => optional($this->maxPriority(0))->priority + 1
        ];
        $service = Service::create($data);

        return $service ? $service : null;
    }

    public function update(Service $service, string $title): bool
    {
        $data = [
            'title' => $title,
        ];

        return $service->update($data);
    }

    public function delete(Service $service): bool
    {
        $parentId = $service->parent_id;
        $result = $service->delete();

        $this->updatePriorities($parentId);

        return $result;
    }

    public function setParent(Service $service, int $parentId): bool
    {
        $data = [
            'parent_id' => $parentId,
            'priority' => optional($this->maxPriority($parentId))->priority + 1,
        ];
        $oldParentId = $service->parent_id;
        $updated = $service->update($data);

        if ($oldParentId !== $parentId) {
            $this->updatePriorities($oldParentId);
        }

        $this->updatePriorities($parentId);

        return $updated;
    }

    public function upPriority(Service $service): bool
    {
        if (($max = $this->maxPriority($service->parent_id)) && $max->id !== $service->id) {
            $data = ['priority' => $service->priority + 1];

            $service->update($data);
            $this->decrementPriorities($service->parent_id, $service->id, $service->priority);
            $this->updatePriorities($service->parent_id);

            return true;
        }

        return false;
    }

    public function downPriority(Service $service): bool
    {
        if (($min = $this->minPriority($service->parent_id)) && $min->id !== $service->id && $service->priority > 0) {
            $data = ['priority' => $service->priority - 1];

            $service->update($data);
            $this->incrementPriorities($service->parent_id, $service->id, $service->priority);
            $this->updatePriorities($service->parent_id);

            return true;
        }

        return false;
    }

    public function updatePriorities(int $parentId): bool
    {
        if ($services = $this->allByParentId($parentId)) {
            $priority = 1;

            foreach ($services as $service) {
                $data = ['priority' => $priority++];

                $service->update($data);
            }

            return true;
        }

        return false;
    }

    private function allByParentId(int $parentId)
    {
        return Service::where('parent_id', $parentId)->orderBy('priority', 'ASC')->orderBy('title', 'DESC')->orderBy('id', 'DESC')->get();
    }

    private function maxPriority(int $parentId)
    {
        return Service::where('parent_id', $parentId)->orderBy('priority', 'DESC')->orderBy('title', 'DESC')->orderBy('id', 'DESC')->first();
    }

    private function minPriority(int $parentId)
    {
        return Service::where('parent_id', $parentId)->orderBy('priority', 'ASC')->orderBy('title', 'DESC')->orderBy('id', 'DESC')->first();
    }

    private function incrementPriorities(int $parentId, int $exceptId, int $priority)
    {
        return Service::where('parent_id', $parentId)->where('id', '!=', $exceptId)->where('priority', $priority)->increment('priority');
    }

    private function decrementPriorities(int $parentId, int $exceptId, int $priority)
    {
        return Service::where('parent_id', $parentId)->where('id', '!=', $exceptId)->where('priority', $priority)->decrement('priority');
    }
}

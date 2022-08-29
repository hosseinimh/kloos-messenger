<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => intval($this->id),
            'title' => $this->title ?? '',
            'image' => $this->image ?? null,
            'parentId' => intval($this->parent_id),
        ];
    }
}

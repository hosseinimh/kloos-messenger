<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => intval($this->id),
            'title' => $this->title ?? '',
            'summary' => $this->summary ?? '',
            'body' => $this->body ?? '',
            'thumbnail' => $this->thumbnail ?? null,
            'image' => $this->image ?? null,
            'serviceId' => intval($this->service_id),
            'active' => intval($this->active),
            'viewCount' => intval($this->view_count),
        ];
    }
}

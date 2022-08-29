<?php

namespace App\Repositories;

use App\Interfaces\PostRepositoryInterface;
use App\Models\Post;
use App\Models\Service;

class PostRepository extends Repository implements PostRepositoryInterface
{
    public function get(int $id): mixed
    {
        return Post::where('id', $id)->first();
    }

    public function paginate(Service $service, int $page, int $pageItems): mixed
    {
        return Post::where('service_id', $service->id)->orderBy('created_at', 'DESC')->orderBy('id', 'ASC')->skip(($page - 1) * $pageItems)->take($pageItems)->get();
    }

    public function store(Service $service, string $title, string $summary, string $body): mixed
    {
        $data = [
            'service_id' => $service->id,
            'title' => $title,
            'summary' => $summary ?? '',
            'body' => $body ?? '',
            'active' => 0,
            'view_count' => 0,
        ];
        $post = Post::create($data);

        return $post ? $post : null;
    }

    public function update(Post $post, string $title, string $summary, string $body): bool
    {
        $data = [
            'title' => $title,
            'summary' => $summary ?? '',
            'body' => $body ?? '',
        ];

        return $post->update($data);
    }

    public function delete(Post $post): bool
    {
        return $post->delete();
    }
}

<?php

namespace App\Interfaces;

use App\Models\Post;
use App\Models\Service;

interface PostRepositoryInterface
{
    public function get(int $postId): mixed;
    public function paginate(Service $service, int $page, int $pageItems): mixed;
    public function store(Service $service, string $title, string $summary, string $body): mixed;
    public function update(Post $post, string $title, string $summary, string $body): bool;
    public function delete(Post $post): bool;
}

<?php

namespace App\Http\Controllers;

use App\Constants\ErrorCode;
use App\Http\Requests\Post\IndexPostsRequest;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Post;
use App\Models\Service;
use App\Repositories\PostRepository;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class PostController extends Controller
{
    private string $thumbnailStorage;
    private string $imageStorage;

    public function __construct(JsonResponse $response, private PostRepository $repository)
    {
        parent::__construct($response);

        $this->thumbnailStorage = 'public/storage/posts/thumbnails';
        $this->imageStorage = 'public/storage/posts/images';
    }

    public function index(Service $service, IndexPostsRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate($service, $request->_pn, $request->_pi));
    }

    public function show(Post $post): HttpJsonResponse
    {
        return $this->onItem($post);
    }

    public function store(Service $service, StorePostRequest $request): HttpJsonResponse
    {
        if (($post = $this->repository->store($service, $request->title, $request->summary, $request->body))) {
            $response = [];
            $uploadResult = (new FileUploaderController($this->thumbnailStorage))->uploadImage($post, $request, 'thumbnail', 'thumbnail');
            $response['uploadedThumbnail'] = $uploadResult['uploaded'];
            $response['uploadedThumbnailText'] = $uploadResult['uploadedText'];

            $uploadResult = (new FileUploaderController($this->imageStorage))->uploadImage($post, $request, 'image', 'image');
            $response['uploadedImage'] = $uploadResult['uploaded'];
            $response['uploadedImageText'] = $uploadResult['uploadedText'];

            return $this->onOk($response);
        }

        return $this->onError(['_error' => __('general.store_error'), '_errorCode' => ErrorCode::STORE_ERROR]);
    }

    public function update(Post $post, UpdatePostRequest $request): HttpJsonResponse
    {
        if ($this->repository->update($post, $request->title, $request->summary, $request->body)) {
            $uploadResult = (new FileUploaderController($this->thumbnailStorage))->uploadImage($post, $request, 'thumbnail', 'thumbnail');
            $response['uploadedThumbnail'] = $uploadResult['uploaded'];
            $response['uploadedThumbnailText'] = $uploadResult['uploadedText'];

            $uploadResult = (new FileUploaderController($this->imageStorage))->uploadImage($post, $request, 'image', 'image');
            $response['uploadedImage'] = $uploadResult['uploaded'];
            $response['uploadedImageText'] = $uploadResult['uploadedText'];

            return $this->onOk($response);
        }

        return $this->onError(['_error' => __('general.update_error'), '_errorCode' => ErrorCode::UPDATE_ERROR]);
    }

    public function destroy(Post $post): HttpJsonResponse
    {
        return $this->onDelete($this->repository->delete($post));
    }
}

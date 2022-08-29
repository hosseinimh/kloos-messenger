<?php

namespace App\Providers;

use App\Constants\Theme;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\UserController;
use App\Http\Resources\PositionResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\UserResource;
use App\Repositories\PositionRepository;
use App\Repositories\PostRepository;
use App\Repositories\ServiceRepository;
use App\Repositories\UserRepository;
use App\Services\JsonResponse;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

require_once __DIR__ . '/../../server-config.php';

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
    }

    public function boot()
    {
        $this->app->bind('path.public', function () {
            return PUBLIC_PATH;
        });

        View::share('THEME', Theme::class);

        $this->app->bind(DashboardController::class, function ($app) {
            return new DashboardController($app->make(JsonResponse::class));
        });

        $this->app->bind(PositionController::class, function ($app) {
            return new PositionController(new JsonResponse(PositionResource::class), $app->make(PositionRepository::class));
        });

        $this->app->bind(PostController::class, function ($app) {
            return new PostController(new JsonResponse(PostResource::class), $app->make(PostRepository::class));
        });

        $this->app->bind(ServiceController::class, function ($app) {
            return new ServiceController(new JsonResponse(ServiceResource::class), $app->make(ServiceRepository::class));
        });

        $this->app->bind(UserController::class, function ($app) {
            return new UserController(new JsonResponse(UserResource::class), $app->make(UserRepository::class));
        });
    }
}

<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// not auth users
Route::middleware(['cors'])->group(function () {
    Route::post('users/login', [UserController::class, 'login']);
    Route::post('users/logout', [UserController::class, 'logout']);
});

// auth users
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('dashboard/review', [DashboardController::class, 'review']);

    Route::post('users', [UserController::class, 'index']);
    Route::post('users/show/{user}', [UserController::class, 'show']);
    Route::post('users/update/{user}', [UserController::class, 'update']);
    Route::post('users/change_password/{user}', [UserController::class, 'changePassword']);

    Route::post('positions', [PositionController::class, 'index']);
    Route::post('positions/all', [PositionController::class, 'getAllByParentId']);
    Route::post('positions/show/{position}', [PositionController::class, 'show']);
    Route::post('positions/store', [PositionController::class, 'store']);
    Route::post('positions/update/{position}', [PositionController::class, 'update']);
    Route::post('positions/remove/{position}', [PositionController::class, 'destroy']);
    Route::post('positions/up_priority/{position}', [PositionController::class, 'upPriority']);
    Route::post('positions/down_priority/{position}', [PositionController::class, 'downPriority']);
    Route::post('positions/set_parent/{position}', [PositionController::class, 'setParent']);

    Route::post('services', [ServiceController::class, 'index']);
    Route::post('services/all', [ServiceController::class, 'getAll']);
    Route::post('services/show/{service}', [ServiceController::class, 'show']);
    Route::post('services/store', [ServiceController::class, 'store']);
    Route::post('services/update/{service}', [ServiceController::class, 'update']);
    Route::post('services/remove/{service}', [ServiceController::class, 'destroy']);
    Route::post('services/up_priority/{service}', [ServiceController::class, 'upPriority']);
    Route::post('services/down_priority/{service}', [ServiceController::class, 'downPriority']);
    Route::post('services/set_parent/{service}', [ServiceController::class, 'setParent']);

    Route::post('posts/{service}', [PostController::class, 'index']);
    Route::post('posts/show/{post}', [PostController::class, 'show']);
    Route::post('posts/store/{service}', [PostController::class, 'store']);
    Route::post('posts/update/{post}', [PostController::class, 'update']);
    Route::post('posts/remove/{post}', [PostController::class, 'destroy']);
});

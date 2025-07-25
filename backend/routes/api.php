<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SocialiteController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::apiResource('categories',CategoryController::class);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Apply web middleware to Google OAuth routes to enable session support
Route::middleware(['web'])->group(function () {
    Route::get('/auth/google/redirect', [SocialiteController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/orders',[OrderController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::post('/products/{product}/upload-image', [ProductController::class, 'uploadImage']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',function(Request $request) {
        return $request->user();
    });
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('cart/{productId}', [CartController::class, 'update']);
    Route::delete('cart/{productId}', [CartController::class, 'destroy']);
    Route::post('/cart/merge',[CartController::class, 'merge']);

    // Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::get('/user/orders', [ProfileController::class, 'myOrders']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/test', function () {
        return response()->json(['message' => 'Welcome, Admin!']);
    });
});
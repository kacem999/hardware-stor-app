<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::apiResource('categories',CategoryController::class);
Route::apiResource('products',ProductController::class);



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
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/test', function () {
        return response()->json(['message' => 'Welcome, Admin!']);
    });
});
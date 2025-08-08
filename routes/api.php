<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('messages', [\App\Http\Controllers\ChatController::class, 'message']);




Route::middleware('auth:sanctum')->group(function () {
    Route::get('/chat-groups/{id}/messages', [MessageController::class, 'index']);
    Route::post('/chat-groups/{id}/messages', [MessageController::class, 'store']);
});

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Models\TouristAttraction;

use App\Http\Controllers\ChatGroupController;
use App\Http\Controllers\TripController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('messages', [\App\Http\Controllers\ChatController::class, 'message']);



Route::middleware('auth:sanctum')->group(function () {
 Route::get('/chat-groups', [ChatGroupController::class, 'index']);
    Route::get('/chat-groups/{id}/messages', [MessageController::class, 'index']);
    Route::post('/chat-groups/{id}/messages', [MessageController::class, 'store']);
});


// Route::get('/tourist-attractions', function () {
//     return TouristAttraction::select('id', 'latitude', 'longitude', 'description')->get();
// });




Route::get('/tourist-attractions', function () {
    return TouristAttraction::with('images')->get();
});

Route::get('/tourist-attractions/{id}', function ($id) {
    return TouristAttraction::with('images')->findOrFail($id);
});
// Route::get('/tourist-attractions', function () {
//     return TouristAttraction::all();
// });
//
// Route::get('/tourist-attractions/{id}', function ($id) {
//     return TouristAttraction::with('images')->findOrFail($id);
// });
//
//
//
//
//
//


//
//
//
//
//
Route::get('/trips', [TripController::class, 'index']); // ดึง list
Route::post('/trips', [TripController::class, 'store']);      // สร้างทริปใหม่
Route::get('/trips/{id}', [TripController::class, 'show']); // ดู detail
Route::middleware('auth:sanctum')->post('/trips/{trip}/join', [TripController::class, 'join']);

// routes/api.php
Route::middleware('auth:sanctum')->get('/my-trips', [TripController::class, 'myTrips']);

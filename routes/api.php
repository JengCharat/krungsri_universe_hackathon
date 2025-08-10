<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Models\TouristAttraction;

use App\Http\Controllers\TripController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('messages', [\App\Http\Controllers\ChatController::class, 'message']);



Route::middleware('auth:sanctum')->group(function () {
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

Route::post('/trips', [TripController::class, 'store']);
Route::get('/trips/{id}', [TripController::class, 'show']);

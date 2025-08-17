<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\TouristAttractionController;
use App\Http\Controllers\TripController;
Route::get('/', function () {
    return view('welcome');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});






Route::get('/map', function () {
    $user = Auth::user();
    $token = $user->createToken('chat-token')->plainTextToken;
    $chatGroupId = 1; // ตัวอย่าง
    $role = $user->role; // ต้องมีคอลัมน์ role ใน users table

    return view('app', compact('token', 'chatGroupId', 'role'));
})->middleware('auth');






Route::middleware('auth:sanctum')->group(function () {
    // CRUD สำหรับ Tourist Attraction
    Route::get('/tourist-attractions', [TouristAttractionController::class, 'index']); // แสดงรายการทั้งหมด
    Route::post('/tourist-attractions', [TouristAttractionController::class, 'store']); // เพิ่มใหม่
    Route::post('/trips_uploads', [TripController::class, 'store']); // เพิ่มใหม่
    Route::get('/tourist-attractions/{id}', [TouristAttractionController::class, 'show']); // ดูข้อมูลเดี่ยว
    Route::put('/tourist-attractions/{id}', [TouristAttractionController::class, 'update']); // แก้ไข
    Route::delete('/tourist-attractions/{id}', [TouristAttractionController::class, 'destroy']); // ลบ

    // ดึงสถานที่ของ user คนนั้น ๆ
    Route::get('/users/{user}/tourist-attractions', [TouristAttractionController::class, 'getByUser']);
});







Route::get('/admin', function () {
    return 'Welcome Admin!';
})->middleware('checkRole:admin');

Route::get('/user', function () {
    return 'Welcome User!';
})->middleware('checkRole:user');



Route::get('/upload_place', function () {
    return view('upload_place');
})->middleware('auth');

Route::get('/chatpage', function () {
    $token = Auth::user()->createToken('chat-token')->plainTextToken;
    $chatGroupId = 1; // ตัวอย่าง

    return view('chatpage', compact('token', 'chatGroupId'));
})->middleware('auth');





Route::get('/all_trip', function () {
    if (!Auth::check()) {
        return redirect('/login'); // หรือจะ return 403 ก็ได้
    }

    $token = Auth::user()->createToken('chat-token')->plainTextToken;

    return view('all_trip', compact('token'));
})->middleware('auth');

Route::get('/my-trips', function () {
    if (!Auth::check()) {
        return redirect('/login'); // หรือจะ return 403 ก็ได้
    }

    $token = Auth::user()->createToken('chat-token')->plainTextToken;

    return view('my_trips', compact('token'));
})->middleware('auth');
// Route::get('/all_trip', function () {
//     $token = Auth::user()->createToken('chat-token')->plainTextToken;
//
//     return view('all_trip', compact('token'));
// })->middleware('auth');
//
//
//
//
//

Route::get('/all_chat', function () {
    $token = Auth::user()->createToken('chat-token')->plainTextToken;
    $chatGroupId = 1; // ตัวอย่าง

    return view('all_chat', compact('token', 'chatGroupId'));
})->middleware('auth');



Route::get('/all_trip_for_guide', function () {
     $user = Auth::user();
    if (!Auth::check()) {
        return redirect('/login'); // หรือจะ return 403 ก็ได้
    }
            if ($user->role !== 'guide') {
            abort(403, 'คุณไม่มีสิทธิเข้าถึงหน้านี้');
            }

    $token = Auth::user()->createToken('chat-token')->plainTextToken;

    return view('all_trip_for_guide', compact('token'));
})->middleware('auth');

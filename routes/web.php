<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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






Route::get('/test', function () {
    $token = Auth::user()->createToken('chat-token')->plainTextToken;
    $chatGroupId = 1; // ตัวอย่าง

    return view('app', compact('token', 'chatGroupId'));
})->middleware('auth');






Route::get('/map', function () {
    return view('map');
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

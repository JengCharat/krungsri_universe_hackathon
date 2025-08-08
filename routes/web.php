<?php

use Illuminate\Support\Facades\Route;

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
    return view('app');
});

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

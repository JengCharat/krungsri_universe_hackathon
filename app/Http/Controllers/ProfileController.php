<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileController extends Controller
{
    // ดึงข้อมูล profile ของผู้ใช้ที่ login
// ProfileController.php
public function show(Request $request)
{
    $user = $request->user();

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
        'profile_photo_path' => $user->profile_photo_path, // ใช้ column จริง
        'avatarUrl' => $user->profile_photo_path
            ? asset('storage/' . $user->profile_photo_path)
            : asset('default-avatar.png'), // ส่ง default ถ้าไม่มีรูป
    ]);
}

    // อัปเดตข้อมูล profile
// ProfileController.php
public function update(Request $request)
{
    $user = $request->user();

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        'avatar' => 'nullable|image|max:2048',
    ]);

    $user->name = $request->name;
    $user->email = $request->email;

    if ($request->hasFile('avatar')) {
        $file = $request->file('avatar');
        $filename = uniqid() . $file->getClientOriginalName();
        $file->storeAs('avatars', $filename, 'public'); // ระบุ disk 'public'
        $user->profile_photo_path = $filename;
    }

    $user->save();

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user,
    ]);
}
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ProfileController extends Controller
{
    // ดึงข้อมูล profile ของผู้ใช้ที่ login
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'social_media' => $user->social_media,
            'description' => $user->description,
            'role' => $user->role,
            'profile_photo_path' => $user->profile_photo_path,
            'avatarUrl' => $user->profile_photo_path
                ? asset('storage/avatars/' . $user->profile_photo_path)
                : asset('default-avatar.png'),
        ]);
    }

    // อัปเดตข้อมูล profile
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'social_media' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'avatar' => 'nullable|image|max:2048',
        ]);

        // อัปเดตข้อมูลทั่วไป
        $user->name = $request->name;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->social_media = $request->social_media;
        $user->description = $request->description;

        // อัปโหลด avatar
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = uniqid() . $file->getClientOriginalName();
            $file->storeAs('avatars', $filename, 'public'); // เก็บใน storage/app/public/avatars
            $user->profile_photo_path = $filename; // เก็บเฉพาะชื่อไฟล์
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}

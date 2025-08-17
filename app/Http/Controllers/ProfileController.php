<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileController extends Controller
{
    // ดึงข้อมูล profile ของผู้ใช้ที่ login
    public function show(Request $request)
    {
        $user = $request->user(); // หรือ Auth::user()
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatarUrl' => $user->avatar_url, // สมมติ column avatar_url
        ]);
    }

    // อัปเดตข้อมูล profile
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'avatarUrl' => 'nullable|url',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->avatarUrl) {
            $user->avatar_url = $request->avatarUrl;
        }
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatGroupController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // ดึง chat groups ของ user โดยเลือกเฉพาะฟิลด์จาก chat_groups เพื่อป้องกัน ambiguous column 'id'
        $chatGroups = $user->chatGroups()
            ->select('chat_groups.id', 'chat_groups.name', 'chat_groups.description')
            ->get();

        return response()->json($chatGroups);
    }
}

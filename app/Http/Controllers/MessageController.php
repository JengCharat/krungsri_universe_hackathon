<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function index($chatGroupId)
    {
        $isMember = DB::table('chat_group_user')
            ->where('chat_group_id', $chatGroupId)
            ->where('user_id', Auth::id())
            ->exists();

        if (!$isMember) {
            return response()->json(['error' => 'You are not a member of this chat group'], 403);
        }

        return Message::with('user')
            ->where('chat_group_id', $chatGroupId)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function store(Request $request, $chatGroupId)
    {
        $isMember = DB::table('chat_group_user')
            ->where('chat_group_id', $chatGroupId)
            ->where('user_id', Auth::id())
            ->exists();

        if (!$isMember) {
            return response()->json(['error' => 'You are not a member of this chat group'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $msg = Message::create([
            'chat_group_id' => $chatGroupId,
            'user_id' => Auth::id(),
            'message' => $validated['message']
        ]);

        return $msg->load('user');
    }
}

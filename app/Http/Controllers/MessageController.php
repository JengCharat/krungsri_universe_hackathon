<?php
namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    // ดึงข้อความของกลุ่ม
    public function index($chatGroupId)
    {
        return Message::with('user')
            ->where('chat_group_id', $chatGroupId)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    // ส่งข้อความ
    public function store(Request $request, $chatGroupId)
    {
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

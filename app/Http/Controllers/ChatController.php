<?php

namespace App\Http\Controllers;

use App\Events\Message;
use Illuminate\Http\Request;
use App\Events\MyEvent;
class ChatController extends Controller
{
    public function message(Request $request)
    {
        event(new Message($request->input('username'), $request->input('message')));

        // event(new MyEvent('hello world'));

        return [];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatGroup extends Model
{
    public function members() {
        return $this->belongsToMany(User::class, 'chat_group_user')
                    ->withPivot('role', 'joined_at')
                    ->withTimestamps();
    }
    public function messages() {
        return $this->hasMany(Message::class);
    }
}

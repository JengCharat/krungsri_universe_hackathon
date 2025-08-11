<?php
// App\Models\ChatGroup.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatGroup extends Model
{
    protected $fillable = [
        'name',
        'description',
        'owner_id',
    ];

    public function members() {
        return $this->belongsToMany(User::class, 'chat_group_user')
                    ->withPivot('role', 'joined_at')
                    ->withTimestamps();
    }

    // เพิ่ม alias ให้ใช้ได้ทั้ง users() และ members()
    public function users() {
        return $this->members();
    }

    public function messages() {
        return $this->hasMany(Message::class);
    }
}

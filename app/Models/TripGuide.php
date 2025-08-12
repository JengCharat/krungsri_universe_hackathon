<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripGuide extends Model
{
    use HasFactory;

    protected $table = 'trip_guides';

    protected $fillable = [
        'trip_id',
        'guide_id',
        'price',
        'status',
    ];

    // ความสัมพันธ์กับ Trip
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    // ความสัมพันธ์กับ User (ไกด์)
    public function guide()
    {
        return $this->belongsTo(User::class, 'guide_id');
    }
}

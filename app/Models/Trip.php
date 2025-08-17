<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = [
        'tourist_attraction_id',
        'created_by',
        'name',
        'description',
        'start_date',
        'start_time',
        'status',
        'end_date',
        'conditions',
        'max_people',
        'needs_guide',
        'needs_driver',
    ];

    // append accessor ให้ส่งไปกับ JSON
    protected $appends = ['is_danger'];

    // Relations
    public function attraction()
    {
        return $this->belongsTo(TouristAttraction::class, 'tourist_attraction_id');
    }

    public function touristAttractions()
    {
        return $this->belongsToMany(TouristAttraction::class, 'trip_tourist_attraction');
    }

    public function guide()
    {
        return $this->belongsTo(User::class, 'guide_id');
    }

    public function guides()
    {
        return $this->belongsToMany(User::class, 'trip_guides', 'trip_id', 'guide_id')
                    ->withPivot(['price', 'status', 'confirmed_end'])
                    ->withTimestamps();
    }

    public function tripGuides()
    {
        return $this->hasMany(TripGuide::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'trip_user')
                    ->withPivot('confirmed_end')
                    ->withTimestamps();
    }

    // accessor สำหรับเช็คว่าทริปเกิน 24 ชั่วโมงแล้วหรือยัง
    public function getIsDangerAttribute()
    {
        if (!$this->start_date || $this->status === 'ended') {
            return false;
        }

        $startDateTime = Carbon::parse("{$this->start_date} {$this->start_time}");
        return Carbon::now()->gt($startDateTime->addHours(24));
    }
}

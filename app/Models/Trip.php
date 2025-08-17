<?php
// app/Models/Trip.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
 protected $fillable = [
        'tourist_attraction_id',
        'created_by',
        'name',
        'description',
        'start_date',
        'status',
        'end_date',
        'conditions',   // เพิ่มตรงนี้
        'max_people' ,   // เพิ่มตรงนี้
        'needs_guide', 'needs_driver'
    ];

    // public function users()
    // {
    //     return $this->belongsToMany(User::class, 'trip_user')->withTimestamps();
    // }

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
                            ->withPivot(['price', 'status', 'confirmed_end']) // ✅ เพิ่ม confirmed_end
                            ->withTimestamps();
            }

                // ความสัมพันธ์กับ Trip (ถ้าต้องการ)
                public function trip()
                {
                    return $this->belongsTo(Trip::class);
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

}

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
        'end_date',
        'conditions',   // เพิ่มตรงนี้
        'max_people' ,   // เพิ่มตรงนี้
'needs_guide', 'needs_driver'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'trip_user')->withTimestamps();
    }

    public function attraction()
    {
        return $this->belongsTo(TouristAttraction::class, 'tourist_attraction_id');
    }
     public function touristAttractions()
        {

            return $this->belongsToMany(TouristAttraction::class, 'trip_tourist_attraction');
        }
}

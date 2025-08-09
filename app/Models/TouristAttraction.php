<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TouristAttraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'posted_by',
        'name',
        'image',
        'latitude',
        'longitude',
        'description',
        'open_time',
        'close_time',
        'entrance_fee',
        'tag',
        'contact_info',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
     public function images()
        {
            return $this->hasMany(TouristAttractionImage::class);
        }
}

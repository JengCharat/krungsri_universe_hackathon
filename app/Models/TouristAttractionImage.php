<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TouristAttractionImage extends Model
{
    protected $fillable = ['tourist_attraction_id', 'image_path'];

    public function touristAttraction()
    {
        return $this->belongsTo(TouristAttraction::class);
    }

}

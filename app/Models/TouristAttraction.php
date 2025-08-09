<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TouristAttraction extends Model
{
    //

    public function user()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }
}

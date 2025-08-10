<?php
namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TouristAttraction;
use Illuminate\Http\Request;

// TripController.php

class TripController extends Controller
{
    public function store(Request $request)
    {
        $touristAttractionId = $request->input('tourist_attraction_id');

        $touristAttraction = TouristAttraction::findOrFail($touristAttractionId);

        $trip = Trip::create([
            'name' => $request->input('name', 'My Trip'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ]);

        $trip->touristAttractions()->attach($touristAttraction->id);

        return response()->json($trip, 201); // API response แบบ JSON
    }

    public function show($id)
    {
        $trip = Trip::with('touristAttractions')->findOrFail($id);
        return response()->json($trip);
    }
}

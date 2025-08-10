<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TouristAttraction;
use Illuminate\Http\Request;

class TripController extends Controller
{
    // ดึงรายการทริปทั้งหมด พร้อม tourist attractions ที่เกี่ยวข้อง
    public function index()
    {
        $trips = Trip::with('touristAttractions')->get();
        return response()->json($trips);
    }

    // สร้างทริปใหม่และผูกกับสถานที่ท่องเที่ยว
    public function store(Request $request)
    {
        $touristAttractionId = $request->input('tourist_attraction_id');

        $touristAttraction = TouristAttraction::findOrFail($touristAttractionId);

        $trip = Trip::create([
            'name' => $request->input('name', 'My Trip'),
            'start_date' => $request->input('start_date'),
        ]);

        $trip->touristAttractions()->attach($touristAttraction->id);

        return response()->json($trip, 201);
    }

    // ดูรายละเอียดทริป พร้อม tourist attractions
    public function show($id)
    {
        $trip = Trip::with('touristAttractions')->findOrFail($id);
        return response()->json($trip);
    }







public function join(Request $request, Trip $trip)
{
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    if ($trip->users()->where('user_id', $user->id)->exists()) {
        return response()->json(['message' => 'คุณได้เข้าร่วมทริปนี้แล้ว'], 400);
    }

    if ($trip->users()->count() >= $trip->max_people) {
        return response()->json(['message' => 'ทริปเต็มแล้ว'], 400);
    }

    $trip->users()->attach($user->id);

    return response()->json(['message' => 'เข้าร่วมทริปสำเร็จ']);
}
}

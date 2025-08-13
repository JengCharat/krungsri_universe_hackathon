<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TouristAttraction;
use Illuminate\Http\Request;
use App\Models\ChatGroup;
use App\Models\TripGuide;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class TripController extends Controller
{
            public function chooseGuide($tripId, $guideId, Request $request)
            {
                $userId = $request->user()->id;

                // ตรวจสอบว่าทริปนี้เป็นของ user ที่ล็อกอิน
                $trip = Trip::where('id', $tripId)
                            ->where('created_by', $userId)
                            ->first();

                if (!$trip) {
                    return response()->json(['message' => 'ไม่พบข้อมูลทริปหรือไม่มีสิทธิ์'], 404);
                }

                // อัปเดตสถานะ trip_guides ทั้งหมดของทริปเป็น rejected
                TripGuide::where('trip_id', $tripId)->update(['status' => 'rejected']);

                // อัปเดตสถานะไกด์ที่ถูกเลือกเป็น selected
                TripGuide::where('trip_id', $tripId)
                         ->where('guide_id', $guideId)
                         ->update(['status' => 'selected']);

                // เช็คว่ามีไกด์นี้ในความสัมพันธ์ guides ของ trip หรือยัง (สมมติว่าใน Trip model มีความสัมพันธ์ guides())
                if (!$trip->guides()->where('guide_id', $guideId)->exists()) {
                    // ผูกไกด์เข้าทริป (ไม่เพิ่ม current_people)
                    $trip->guides()->attach($guideId, [
                        'status' => 'selected',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // หา chat group ของ trip นี้ ถ้าไม่มีให้สร้าง
                $chatGroup = \App\Models\ChatGroup::firstOrCreate(
                    ['name' => 'Chat Group for Trip: ' . $trip->name],
                    [
                        'description' => 'กลุ่มแชทของทริป ' . $trip->name,
                        'owner_id' => $trip->created_by ?? $userId
                    ]
                );

                // เพิ่มไกด์เข้า chat group (ถ้ายังไม่มี)
                $chatGroup->users()->syncWithoutDetaching([
                    $guideId => [
                        'role' => 'guide',
                        'joined_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);

                return response()->json(['message' => 'เลือกไกด์เรียบร้อยและเพิ่มเข้าในทริปและกลุ่มแชทแล้ว']);
            }
    // ดึงรายการทริปทั้งหมด พร้อม tourist attractions ที่เกี่ยวข้อง
                    public function myTripDetail($id, Request $request)
                    {
                        $userId = $request->user()->id;

                        // ดึงทริปที่สร้างโดย user ที่ล็อกอิน พร้อมความสัมพันธ์ touristAttractions และ trip_guides กับ guide
                        $trip = Trip::with(['touristAttractions', 'tripGuides.guide'])
                            ->where('id', $id)
                            ->where('created_by', $userId)
                            ->first();
 \Log::info('Trip Detail:', $trip ? $trip->toArray() : []);
                        if (!$trip) {
                            return response()->json(['message' => 'ไม่พบข้อมูลทริป หรือคุณไม่มีสิทธิ์เข้าถึง'], 404);
                        }

                        return response()->json($trip);
                    }

            public function getTripsForGuide()
            {
                $trips = Trip::with('touristAttractions')
                    ->where(function ($query) {
                        $query->where('needs_guide', true)
                              ->orWhere('needs_driver', true);
                    })
                    ->get();

                return response()->json($trips);
            }
            public function offerPrice(Request $request)
            {
                $request->validate([
                    'trip_id' => 'required|exists:trips,id',
                    'price' => 'required|numeric|min:0',
                ]);

                $user = Auth::user();

                // สร้าง record ใน trip_guides
                $tripGuide = TripGuide::updateOrCreate(
                    [
                        'trip_id' => $request->trip_id,
                        'guide_id' => $user->id,
                    ],
                    [
                        'price' => $request->price,
                        'status' => 'pending',
                    ]
                );

                return response()->json(['message' => 'เสนอราคาเรียบร้อย']);
            }
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

                $userId = auth()->id();

                DB::beginTransaction();

                try {
                    $trip = Trip::create([
                        'created_by'   => $userId,
                        'name'         => $request->input('name', 'My Trip'),
                        'start_date'   => $request->input('start_date'),
                        'conditions'   => $request->input('conditions', ''),
                        'max_people'   => $request->input('max_people', 1),
                        'needs_guide'  => $request->boolean('needs_guide', false),
                        'needs_driver' => $request->boolean('needs_driver', false),
                    ]);

                    // ผูก tourist attraction กับ trip
                    $trip->touristAttractions()->attach($touristAttraction->id);

                    // เพิ่มเจ้าของทริปเข้า trip_user
                    $trip->users()->attach($userId);

                    // สร้าง chat group
                    $chatGroup = ChatGroup::create([
                        'name'        => 'Chat Group for Trip: ' . $trip->name,
                        'description' => 'Group chat for trip ' . $trip->name,
                        'owner_id'    => $userId,
                    ]);

                    // เพิ่มเจ้าของทริปเข้า chat group
                    $chatGroup->members()->attach($userId, [
                        'role'      => 'owner',
                        'joined_at' => now(),
                    ]);

                    DB::commit();

                    return response()->json($trip, 201);
                } catch (\Exception $e) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Error creating trip: ' . $e->getMessage()
                    ], 500);
                }
            }

    // ดูรายละเอียดทริป พร้อม tourist attractions
    public function show($id)
    {
        $trip = Trip::with('touristAttractions')->findOrFail($id);
        return response()->json($trip);
    }

// TripController.php
        public function myTrips(Request $request) {
            $userId = $request->user()->id;

            $trips = Trip::with('touristAttractions')
                ->where('created_by', $userId)
                ->get();

            return response()->json($trips);
        }







    public function join(Request $request, Trip $trip)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // เช็คว่ามีอยู่แล้วหรือไม่
        if ($trip->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'คุณได้เข้าร่วมทริปนี้แล้ว'], 400);
        }

        // เช็คจำนวนคน
        if ($trip->users()->count() >= $trip->max_people) {
            return response()->json(['message' => 'ทริปเต็มแล้ว'], 400);
        }

        // บันทึกเข้าทริป
        $trip->users()->attach($user->id);

        // อัพเดทจำนวนคน
        $trip->increment('current_people');

        // หา chat group ของ trip นี้ ถ้าไม่มีให้สร้าง
        $chatGroup = \App\Models\ChatGroup::firstOrCreate(
            ['name' => 'Chat Group for Trip: ' . $trip->name],
            [
                'description' => 'กลุ่มแชทของทริป ' . $trip->name,
                'owner_id' => $trip->created_by ?? $user->id
            ]
        );

        // เพิ่ม user เข้า chat group ถ้ายังไม่มี
        $chatGroup->users()->syncWithoutDetaching([
            $user->id => [
                'role' => 'member',
                'joined_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        return response()->json(['message' => 'เข้าร่วมทริปสำเร็จและเข้ากลุ่มแชทแล้ว']);
    }
}

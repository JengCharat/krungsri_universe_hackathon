<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TouristAttraction;
use Illuminate\Http\Request;
use App\Models\ChatGroup;
use Illuminate\Support\Facades\DB;
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

                $userId = auth()->id();

                DB::beginTransaction();

                try {
                    $trip = Trip::create([
                        'created_by'   => $userId,
                        'name'         => $request->input('name', 'My Trip'),
                        'start_date'   => $request->input('start_date'),
                        'conditions'   => $request->input('conditions', ''),
                        'max_people'   => $request->input('max_people', 1),
                    ]);

                    // เพิ่ม tourist attraction ให้ trip
                    $trip->touristAttractions()->attach($touristAttraction->id);

                    // เพิ่ม user เจ้าของทริปเข้า trip_user
                    $trip->users()->attach($userId);
                    // ต้องมี relation users() ในโมเดล Trip

                    // สร้าง chat group สำหรับ trip นี้
                    $chatGroup = ChatGroup::create([
                        'name'        => 'Chat Group for Trip: ' . $trip->name,
                        'description' => 'Group chat for trip ' . $trip->name,
                        'owner_id'    => $userId,
                    ]);

                    // เพิ่ม user เจ้าของทริปเข้า chat group ด้วย role 'owner'
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

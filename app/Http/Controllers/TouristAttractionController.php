<?php
namespace App\Http\Controllers;

use App\Models\TouristAttraction;
use App\Models\TouristAttractionImage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TouristAttractionController extends Controller
{
    public function index()
    {
        return TouristAttraction::with(['user', 'images'])->get();
    }

    public function store(request $request)
    {
        $request->validate([
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'lat' => 'required|numeric|between:-90,90',
            'long' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'open_time' => 'nullable|string',
            'close_time' => 'nullable|string',
            'entry_fee' => 'nullable|numeric',
            'tag' => 'required|in:beach,mountain,temple,historical,cultural,shopping,food,adventure,other',
            'contact_info' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $attraction = TouristAttraction::create([
                'posted_by' => auth()->id(),
                'latitude' => $request->lat,
                'longitude' => $request->long,
                'description' => $request->description,
                'open_time' => $request->open_time,
                'close_time' => $request->close_time,
                'entry_fee' => $request->entry_fee,
                'tag' => $request->tag,
                'contact_info' => $request->contact_info,
            ]);

            // บันทึกรูปภาพหลายไฟล์
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->move(public_path('uploads'), $imageName);

                    TouristAttractionImage::create([
                        'tourist_attraction_id' => $attraction->id,
                        'image_path' => $imageName,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Tourist attraction created successfully!',
                'data' => $attraction->load('images'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create tourist attraction: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        return TouristAttraction::with(['user', 'images'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'lat' => 'sometimes|required|numeric|between:-90,90',
            'long' => 'sometimes|required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'open_time' => 'nullable|string',
            'close_time' => 'nullable|string',
            'entry_fee' => 'nullable|numeric',
            'tag' => 'sometimes|required|in:nature,history,adventure,culture,food',
            'contact_info' => 'nullable|string',
        ]);

        $attraction = TouristAttraction::findOrFail($id);

        DB::beginTransaction();

        try {
            $attraction->update($request->only([
                'latitude', 'longitude', 'description', 'open_time', 'close_time', 'entry_fee', 'tag', 'contact_info'
            ]));

            // ถ้ามีรูปภาพใหม่อัปโหลดเพิ่ม
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->move(public_path('uploads'), $imageName);

                    TouristAttractionImage::create([
                        'tourist_attraction_id' => $attraction->id,
                        'image_path' => $imageName,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Tourist attraction updated successfully!',
                'data' => $attraction->load('images'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update tourist attraction: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $attraction = TouristAttraction::findOrFail($id);
        $attraction->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function getByUser(User $user)
    {
        return $user->touristAttractions()->with('images')->get();
    }
}

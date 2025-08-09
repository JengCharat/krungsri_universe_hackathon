<?php
namespace App\Http\Controllers;

use App\Models\TouristAttraction;
use App\Models\User;
use Illuminate\Http\Request;

class TouristAttractionController extends Controller
{
    public function index()
    {
        return TouristAttraction::with('user')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable|string',
            'lat' => 'required|numeric',
            'long' => 'required|numeric',
            'description' => 'nullable|string',
            'open_time' => 'nullable|string',
            'close_time' => 'nullable|string',
            'entry_fee' => 'nullable|numeric',
            'tag' => 'required|in:nature,history,adventure,culture,food',
            'contact_info' => 'nullable|string',
        ]);

        return TouristAttraction::create([
            // 'user_id' => auth()->id(),
            'posted_by' => auth()->id(),
            'image' => $request->image,
            'latitude' => $request->lat,
            'longitude' => $request->long,
            'description' => $request->description,
            'open_time' => $request->open_time,
            'close_time' => $request->close_time,
            'entry_fee' => $request->entry_fee,
            'tag' => $request->tag,
            'contact_info' => $request->contact_info,
        ]);
    }

    public function show($id)
    {
        return TouristAttraction::with('user')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $attraction = TouristAttraction::findOrFail($id);
        $attraction->update($request->all());
        return $attraction;
    }

    public function destroy($id)
    {
        $attraction = TouristAttraction::findOrFail($id);
        $attraction->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function getByUser(User $user)
    {
        return $user->touristAttractions; // ใช้ relationship
    }
}

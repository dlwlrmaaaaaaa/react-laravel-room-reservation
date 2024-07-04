<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreRoomRequest;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use HttpResponses;
    public function room($id)
    {
        // $room = Room::where('id', $id)->first();
        $room = DB::table('rooms')->where('id', $id)->first();
        return $this->success($room);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(StoreRoomRequest $request)
    {
        $request->validated($request->all());
        $filenames = [];
        if ($request->hasFile('file_name')) { // Check if files were uploaded
            foreach ($request->file('file_name') as $file) {
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/images', $filename);
                // Storage::disk('s3')->put('public/images', $filename);
                $filenames[] = $filename;
            }
        }
        $room = Room::create([
            'room_name' => $request->room_name,
            'price' =>  $request->price,
            'mini_description' =>  $request->mini_description,
            'description' => $request->description,
            'room_amenities' => json_encode($request->room_amenities),
            'maximum_guest' => $request->maximum_guest,
            'file_name' => json_encode($filenames),
        ]);

        return $this->success($room);
    }
    public function getAllRooms()
    {
        return $this->success(DB::table('rooms')->get());
    }
    //  public function updateRoom(StoreRoomRequest $request, $room_id){
    //    return "Hello";
    //  }

    public function updateRoom(StoreRoomRequest $request, $room_id)
    {
        try {
            $request->validated($request->all());
            $room = DB::table('rooms')->where('id', $room_id)->first();
            $filenames = [];
            if ($request->hasFile('file_name')) { // Check if files were uploaded
                foreach ($request->file('file_name') as $file) {
                    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('public/images', $filename);
                    // Storage::disk('s3')->put('public/images', $filename);
                    $filenames[] = $filename;
                }
            }
            if ($room && isset($room->file_name)) {
                $existingFilenames = json_decode($room->file_name, true);
                $filenames = array_merge($existingFilenames, $filenames);
            }

            if ($room) {
                DB::table('rooms')->where('id', $room_id)->update([
                    'room_name' => $request->room_name,
                    'price' =>  $request->price,
                    'mini_description' =>  $request->mini_description,
                    'description' => $request->description,
                    'room_amenities' => json_encode($request->room_amenities),
                    'maximum_guest' => $request->maximum_guest,
                    'file_name' => json_encode($filenames),
                ]);
                DB::commit();
                return $this->success(["Message" => "Room updated successfully"], "Request Success", 200);
            }
            return $this->success(["Message" => "updated record failed"], "Request failed", 500);
        } catch (\Throwable $th) {
            $this->error(["Message" => $th->getMessage()], "Request Failed", 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($room_id)
    {
        $room = DB::table('rooms')->where('id', $room_id)->delete();
        if (!$room) {
            return $this->error(["Message" => "Request Failed"], "Error", 403);
        }
        return $this->success($room, "Room Deleted");
    }
}

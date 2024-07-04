<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserBookingRequest;
use App\Models\Booking;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use HttpResponses;
    public function index()
    {
        $bookings = DB::table('bookings')
            ->join('users', 'bookings.user_id', '=', 'users.id')
            ->select('bookings.room_id', 'users.name as user_name', 'bookings.starting_date', 'bookings.ending_date', 'bookings.status')
            ->get();
        return $this->success($bookings);
    }

    public function create()
    {
        //
    }

    public function store(UserBookingRequest $request)
    {
        $request->validated($request->all());
        try {
            if(!Auth::check()){
                return $this->error(["Message" => "You need to login first before you proceed"], "Request Unauthorized", 403);
            }
            $booking = Booking::create([
                'room_id' => $request->room_id,
                'user_id' => Auth::id(),
                'starting_date' => $request->starting_date,
                'ending_date' => $request->ending_date,
                'status' => 'pending'
            ]);
            return $this->success($booking, Auth::user()->first_name . "Booked a Reservation on " . $request->reserved_date);
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
            $delete_booking = DB::table('bookings')         
            ->where('room_id', $request->room_id)
            ->where('user_id', Auth::id())
            ->where('status', "pending")
            ->delete();

            if($delete_booking){
                return $this->success(["Message" => "Cancelled Booking"], "Request Cancelled Success", 204);
            }
            return $this->error(["Message" => "Error Canceling Booking"], "Request Failed", 500);
        } catch (\Throwable $th) {
            throw $th;
        }

    }
}

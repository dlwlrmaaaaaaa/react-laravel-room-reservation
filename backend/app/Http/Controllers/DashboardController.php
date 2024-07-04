<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use HttpResponses;

    public function getReservation()
    {
        $booking = DB::table('bookings')
            ->join('rooms', 'bookings.room_id', '=', 'rooms.id')
            ->select('room_name', 'bookings.id', 'starting_date', 'ending_date', 'status')
            ->get();
        return $this->success($booking);
    }

    public function getReviews()
    {
        // return $this->success(DB::table('reviews')->get());
        $reviews = DB::table('reviews')
            ->join('users', 'reviews.user_id', '=', 'users.id')
            ->select('name', 'rating', 'comment', 'user_id', 'reviews.created_at')
            ->get();
        return $this->success($reviews);
    }

    public function userCount()
    {
        $count = DB::table('users')->where('role', 'user')->count();
        return response()->json(['count' => $count]);
    }

    public function roomCount()
    {
        $count = DB::table('rooms')->count();
        return response()->json(['count' => $count]);
    }

    public function reservationCount()
    {
        $count = DB::table('bookings')->count();
        return response()->json(['count' => $count]);
    }
}

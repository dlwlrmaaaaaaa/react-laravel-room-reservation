<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Traits\HttpResponses;
use App\Models\Inbox;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    use HttpResponses;
    //
    public function message()
    {
        $user = Auth::user();
        if ($user) {
            $messages = Inbox::where('receiver_email', $user->email)->get();  // Adjust according to your database schema
            return $this->success($messages);
        } else {
            return $this->error($this->getMessage(), 'User not authenticated', 401);
        }
    }

    public function booking()
    {
        $user = Auth::user();
        if (!$user) {
            return $this->error($this, 'User not authenticated', 401);
        }

        $bookings = DB::table('bookings')
            ->join('rooms', 'bookings.room_id', '=', 'rooms.id')
            ->where('bookings.user_id', $user->id)
            ->select('bookings.id', 'rooms.room_name', 'bookings.starting_date', 'bookings.ending_date', 'bookings.status')
            ->get();

        return $this->success($bookings);
    }
}

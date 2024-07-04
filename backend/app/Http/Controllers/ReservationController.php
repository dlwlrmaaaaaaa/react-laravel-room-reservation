<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function reservationInfo(Request $request)
    {
        $dateInfo = $request->query('date');

        $booking = Booking::with(['user:id,email', 'room:id,room_name'])
            ->whereDate('starting_date', '<=', $dateInfo)
            ->whereDate('ending_date', '>=', $dateInfo)
            ->first();

        if ($booking) {
            $userId = $booking->user_id;
            $user = User::find($userId);

            // Format dates using Carbon
            $checkin = Carbon::parse($booking->starting_date)->toDateString();
            $checkout = Carbon::parse($booking->ending_date)->toDateString();

            return response()->json([
                'reservation_date' => $dateInfo,
                'checkin' => $checkin, 
                'customer_name' => $user->name,
                'contact_number' => $booking->contact_number ?? '',
                'checkout' => $checkout, 
                'email_address' => $user->email,
                'room_name' => $booking->room->room_name, 
                'room_status' => $booking->status,
                // Add more reservation information as needed
            ]);
        }
        else{
            return response()->json([
                'reservation_date' => '',
                'checkin' => '', 
                'customer_name' => '',
                'contact_number' => $booking->contact_number ?? '',
                'checkout' => '', 
                'email_address' => '',
                'room_name' => ' ', 
                'room_status' => 'Vacant',
                // Add more reservation information as needed
            ]);
        }
    }
    
}

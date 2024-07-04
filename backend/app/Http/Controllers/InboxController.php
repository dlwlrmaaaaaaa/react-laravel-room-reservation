<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InboxController extends Controller
{
    public function display()
    {
        $users = User::where('role', 'user')
            ->select('name')
            ->get();

        return response($users);
    }

    public function sendMessage(Request $request)
    {
        $validatedData = $request->validate([
            'receiver_email' => 'required|string',
            'message' => 'required|string',
        ]);
    
        // Get the authenticated user's email
        $senderEmail = auth()->user()->email;
        $receiverEmail = User::where('name', $validatedData['receiver_email'])->value('email');
    
        // Create the message
        $message = Inbox::create([
            'receiver_email' => $receiverEmail,
            'message' => $validatedData['message'],
            'sender_email' => $senderEmail,
            'message_date' => Carbon::now(),
            'message_sent' => Carbon::now(),
            'message_received' => Carbon::now(),
        ]);
    
        // Return a response without the message data
        return response()->json(null, 201);
    }
    

    //delete ko muna ibang functions para malinis tignan any further bugs will be monitored!
}

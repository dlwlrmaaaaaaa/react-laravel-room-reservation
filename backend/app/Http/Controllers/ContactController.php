<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\UserMessage; // Update the model import
use Carbon\Carbon;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request)
    {
        $request->validated();
        try {
            $contact = UserMessage::create([
                'name' => $request->name,
                'email' => $request->email,
                'user_messages' => $request->user_messages,
                'date' => now()
            ]);
            return response()->json(['message' => 'Message sent successfully'], 201);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function getAllMessages()
    {
        try {
            $messages = UserMessage::all(['id', 'name', 'email', 'user_messages', 'date']);
            return response()->json($messages);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function deleteMessage(Request $request, $id)
    {
        try {
            $message = UserMessage::find($id);
            if (!$message) {
                return response()->json(['error' => 'Message not found'], 404);
            }
            $message->delete();
            return response()->json(['message' => 'Message deleted successfully']);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}

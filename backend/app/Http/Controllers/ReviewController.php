<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    use HttpResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'room_id' => 'required',
            'rating' => 'required|min:1|max:5',
            'comment' => 'nullable|string|max:255',
            'pictures.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $filenames = [];
        if ($request->hasFile('pictures')) {
            foreach ($request->file('pictures') as $file) {
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/images', $filename);
                $filenames[] = $filename;
            }
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'room_id' =>  $request->room_id,
            'rating' =>  $request->rating,
            'comment' => $request->comment,
            'date_sent' => now(),
            'pictures' => json_encode($filenames),
        ]);

        return $this->success($review);
    }

    public function getRoomName()
    {
        $room = DB::table('rooms')->get(['id', 'room_name']);
        // $room = DB::table('rooms')->get('room_name');
        return $this->success($room, "Retrieve all rooms");
    }

    public function user()
    {
        $user = Auth::user();
        if ($user) {
            return response()->json([
                'data' => [
                    'id' => $user->id
                ]
            ]);
        } else {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
    }

    public function getReviews()
    {
        $booking = DB::table('reviews')
            ->join('users', 'reviews.user_id', '=', 'users.id')
            ->join('rooms', 'reviews.room_id', '=', 'rooms.id')
            ->select('name', 'avatar', 'reviews.rating', 'room_name', 'reviews.comment', 'reviews.pictures', 'reviews.date_sent', 'reviews.created_at')
            ->get();
        $booking = $booking->map(function ($item) {
            $item->pictures = json_decode($item->pictures); // Ensure pictures are decoded
            return $item;
        });
        return $this->success($booking);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        //
    }
}

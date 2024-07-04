<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function user()
    {
        $user = Auth::user();
        if ($user) {
            // Ensure that you are sending back the user data correctly.
            // Convert user object to array if necessary, or selectively send data:
            return response()->json([
                'data' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'contact_number' => $user->contact_number,
                    'avatar' => $user->avatar,
                ]
            ]);
        } else {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'contact_number' => 'required|string',
            'password' => 'nullable|string|min:8',  // Make sure password is nullable
            'avatar' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $user = User::find(Auth::id());
        $user->name = $request->name;
        $user->email = $request->email;
        $user->contact_number = $request->contact_number;

        // Update password only if it's provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = uniqid() . '.' . $avatar->getClientOriginalName();
            $avatar->storeAs('public/avatars', $avatarName);
            // Storage::disk('s3')->put('public/avatars', $avatarName);
            $user->avatar = '/storage/avatars/' . $avatarName;
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully']);
    }
}

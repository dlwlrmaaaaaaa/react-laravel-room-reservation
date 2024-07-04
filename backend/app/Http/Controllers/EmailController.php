<?php

namespace App\Http\Controllers;

use App\Mail\VerifyEmail;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    use HttpResponses;

    public function resend_email_pin(Request $request)
    {
        try {
            $pin = rand(100000, 999999);
            $id = Auth::user()->id;
            DB::table('users')
                ->where('id', $id)
                ->update(['pin' => $pin]);
            Mail::to(Auth::user()->email)->send(new VerifyEmail($pin));
            return $this->success(["Message" => "Check your email for 6-digit-code."]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 'Message', 403);
        }
    }

    public function verifyEmail(Request $request)
    {
        try {
        $user = DB::table('users')->where('email', $request->email)->first();
            if (!$user) {
            return $this->error(["message" => "Invalid email address"], 403);
        }
            if ($request->pin != $user->pin) {
            return $this->error("Your email" . $request->email, "Invalid pin number. Please check your gmail again.", 403);
        }
        DB::table('users')->where('email', $request->email)->update(['email_verified_at' => now()]);
        return $this->success(["role" => $user->role, "name" => $user->name, "email_verified_at" => $user->email_verified_at], ["message" => "Succesfully Registered and Email Verified."], 201);     
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 'Failed to verified your email address', 403);
        }
    }
}

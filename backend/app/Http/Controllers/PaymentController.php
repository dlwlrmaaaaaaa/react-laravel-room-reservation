<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\PaymentRequest;

class PaymentController extends Controller
{
    use HttpResponses;
    public function create_payment (PaymentRequest $request){
            $request->validated($request->all());
           try {
            if(!Auth::check()){
                return $this->error(["Messge" => "Unauthorized"], "Login first before make a request!", 403);
            }
           try {
            $bookings = DB::table('bookings')
            ->where('user_id', Auth::id())
            ->where('status', "pending")
            ->where('room_id', $request->room_id)
            ->where("starting_date", $request->starting_date)
            ->where("ending_date", $request->ending_date)
            ->first();
           } catch (\Throwable $th) {
                return $this->error(["Message" => "Error sa bookings", "Other:" => $th->getMessage()], "Req failed", 500);
           }
        try {
            $payment = Payment::create([
                'user_id' => Auth::id(),
                'booking_id' => $bookings->id,
                'amount' => $request->amount,
                'payment_date' => now()
            ]);  
           } catch (\Throwable $th) {
            return $this->error(["Message" => "Error sa payment", "Other:" => $th->getMessage()], "Req failed", 500);
           } 
          
            try {
                if($payment){
                    DB::table("transactions")
                    ->insert([
                        "payment_id" => $payment->id,
                        "amount" => $payment->amount,
                        "reference_text" => $request->order_id
                    ]);
                    DB::table('bookings')
                    ->where('user_id', Auth::id())
                    ->where('status', "pending")
                    ->where('room_id', $request->room_id)
                    ->where("starting_date", $request->starting_date)
                    ->where("ending_date", $request->ending_date)
                    ->update(['status' => "paid"]);
                    $order_id = Str::uuid()->toString();
                    Mail::to(Auth::user()->email)->send(new EmailReceipt($order_id));
                }
            } catch (\Throwable $th) {
                return $this->error(["Message" => "Error sa if payment", "Other:" => $th->getMessage()], "Req failed", 500);
            }
                return $this->success(["Message" => "Payment Success"], "Request Success", 201);
           } catch (\Throwable $th) {
                return $this->error(["Messge" => "Error in Payment"], $th->getMessage(), 500);
           }        
    }
    public function cancel_payment (PaymentRequest $request){
            $request->validated($request->all());
           try {
            if(!Auth::check()){
                return $this->error(["Messge" => "Unauthorized"], "Login first before make a request!", 403);
            }
            // $amount = DB::table('rooms')->where('id', $room_id)->first();
            $payment = Payment::create([
                'user_id' => Auth::id(),
                'room_id' => $request->room_id,
                'amount' => $request->amount,
                'status' => 'pending'
            ]);  
            return to_route('transaction', ['room_id', $request->room_id, "payment_id" => $payment->id], 200);

           } catch (\Throwable $th) {
                return $this->error(["Messge" => "Error in Payment"], $th->getMessage(), 500);
           }        
    }


}

<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Traits\HttpResponses;
class UserController extends Controller
{
    use HttpResponses;

    public function get_all_users(){
        return $this->success(DB::table('users')->where('role', 'user')->get(), "Fetch all users success", 200);
    }

    public function delete_user($user_id){

        if(!$user_id){
            return $this->error(["Message" => "user id is null"], "Request Failed", 500);
        }
        if(Auth::check()){
            DB::table('users')->wherE('id', $user_id)->delete();
            return $this->success(["Message" => "User Deleted"], "Request Success", 201);
        }
        return $this->error(["Message" => "Unauthorized though"], "Request Failed", 401);
    }
    public function auth_register(Request $request){
        $credentials = $request->validate([
            "name" => "string",
            "email" => "required|email",
            "password" => "required|confirmed|max:20",
            "contact_number" => "string",
            
        ]);
        $credentials["password"] = Hash::make($credentials['password']);
        $credentials["email_verified_at"] = now();
        if(Auth::check() && Auth::user()->role == "admin"){
            DB::table('users')->insert($credentials);
            return $this->success(["Message" => "Record added success"], "Request Success", 201);
        }
        return $this->error(["Message" => "Failed"], "Request Failed", 400);
    }
    public function home(){
        return 'Home';
    }
    public function profile(){
        return 'Profile';
    }
}

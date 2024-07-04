<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\VerifyEmail;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Exception\ClientException;

class AuthenticationController extends Controller
{
    use HttpResponses;

    /**
     * Register a new user.
     *
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function register(StoreUserRequest $request){
        // Validate incoming request data
        $request->validated($request->all());

        try {
            // Generate a 6-digit pin
            $pin = rand(100000, 999999);
            
            // Create a new user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'contact_number' => $request->contact_number,
                'role' => "user",
                'password' => $request->password,
                'pin' => $pin
            ]);

            // Send verification email with pin
            Mail::to($request->email)->send(new VerifyEmail($pin));

            // Login user
            Auth::login($user);

            return $this->success([
                "name" => $user->name,
                "email" => $user->email,
                "role" => "user",
                'message' => 'Successful created user. Please check your email for a 6-digit pin to verify your email.', 
            ]);
        } catch (\Throwable $th) {
            return $this->error(["Message" => $th->getMessage()], "Request Main", 500);
        }
    }

    /**
     * Redirect to Google sign-in page.
     *
     * @return JsonResponse
     */
    public function redirect_google_sign_in(): JsonResponse {
        try {
            // Generate Google sign-in URL
            $url = Socialite::driver('google')
                ->redirect()
                ->getTargetUrl();
            
            return response()->json([
                "url" => $url
            ]);
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }

    /**
     * Handle Google sign-in callback.
     *
     * @return JsonResponse
     */
    public function handleAuthCallback() : JsonResponse{
        try {      
            $socialiteUser = Socialite::driver('google')->user();
        } catch (ClientException $e) {
            return response()->json(['error' => 'Invalid credentials provided.', "Message" => $e->getMessage()], 422);
        }

        // Create or retrieve user from Google sign-in
        $user = User::query()
            ->firstOrCreate(
                [                  
                    'email' => $socialiteUser->getEmail(),               
                ],
                [
                    'google_id' => $socialiteUser->getId(), 
                    'name' => $socialiteUser->getName(),  
                    'role' => 'user',             
                    'email_verified_at' => now(),                 
                    'avatar' => $socialiteUser->getAvatar(),
                ]
            );
        
        // Login user
        Auth::login($user);
        $googleUser = Auth::user();
        
        return response()->json([
            'user' => $googleUser,
        ]);
    }

    /**
     * Authenticate user with email and password.
     *
     * @param LoginUserRequest $request
     * @return JsonResponse
     */
    public function user_login(LoginUserRequest $request){
        // Validate incoming request data
        $request->validated($request->all());   

        try {
            // Attempt to authenticate user
            if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
                $user = Auth::user();

                // Check user role and return appropriate response
                if($user->role == 'admin'){
                    return $this->success(["role" => $user->role, "user" => ["name" => $user->name, "email" => $user->email]], "Login Succesfully", 200);
                }else{
                    return $this->success(["role" => $user->role, "user" => ["name" => $user->name, "email" => $user->email, "email_verified_at" => $user->email_verified_at]], "Login Successfully", 200);
                }
            }else{
                return $this->error(["Message" => "Go Back lods"], "Invalid Credentials", 403);
            }
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(),  "Incorrect email or password!", 403);
        }
    }
    /**
     * Logout authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request){ 
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return $this->success(["Message" => "Logged out"]);
    }
}

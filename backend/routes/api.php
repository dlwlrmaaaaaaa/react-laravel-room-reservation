<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReservationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// User authentication routes
Route::post('/login', [AuthenticationController::class, 'user_login']); // User login
Route::post('/register', [AuthenticationController::class, 'register']); // User registration
Route::get('/auth', [AuthenticationController::class, 'redirect_google_sign_in']); // Google sign-in redirect
Route::get('/auth/callback', [AuthenticationController::class, 'handleAuthCallback']); // Google sign-in callback

// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    // Room management routes
    Route::get('/admin/room/{room_id}', [RoomController::class, 'room']); // Get room details
    Route::post('/admin/room/{room_id}', [RoomController::class, 'updateRoom']); // Update room
    Route::delete('/admin/room/{room_id}', [RoomController::class, 'destroy']); // Delete room
    Route::get('/admin/rooms', [RoomController::class, 'getAllRooms']); // Get all rooms
    Route::post('/admin/add-room', [RoomController::class, 'store']); // Add new room

    // User management routes
    Route::get('/users', [UserController::class, 'get_all_users']); // Get all users
    Route::delete('/delete/user/{user_id}', [UserController::class, 'delete_user']); // Delete user
    Route::post('/admin/add_user', [UserController::class, 'auth_register']); // Add new user

    // Booking routes
    Route::get('/bookings', [BookingController::class, 'index']); // Get all bookings
    Route::post('/reservation', [BookingController::class, 'store']); // Make reservation

    // Messaging routes
    Route::get('/inbox', [InboxController::class, 'display']); // Display inbox
    Route::post('/inbox/message', [InboxController::class, 'sendMessage']); // Send message
    Route::get('/inbox/user', [InboxController::class, 'senuserdMessage']); // Get user's messages

    // Dashboard routes
    Route::post('/admin/dashboard', [DashboardController::class, 'getReservation']); // Get reservation data
    Route::post('/admin/dashboard/reviews', [DashboardController::class, 'getReviews']); // Get reviews
    Route::get('/admin/dashboard/reservation-count', [DashboardController::class, 'reservationCount']); // Get reservation count
    Route::get('/admin/dashboard/room-count', [DashboardController::class, 'roomCount']); // Get room count
    Route::get('/admin/dashboard/user-count', [DashboardController::class, 'userCount']); // Get user count
    Route::get('/reservation-status', [ReservationController::class,'reservationStatus']); // Get reservation status
    Route::get('/reservations-info', [ReservationController::class, 'reservationInfo']); // Get reservation info
});

// Logout route
Route::post('/logout', [AuthenticationController::class, 'logout'])->middleware('auth');

// Authenticated user routes
Route::middleware(['auth', 'role:user'])->group(function () {
    // User-specific routes
    Route::controller(UserController::class)->group(function () {
        Route::get('/home', 'home'); // Home page
        Route::get('/profile', 'profile'); // User profile
    });

    // Room routes
    Route::get('/room/{room_id}', [RoomController::class, 'room']); // Get room details

    // Booking routes
    Route::post('/reservation', [BookingController::class, 'store']); // Make reservation
    Route::post('/cancel_booking', [BookingController::class, 'destroy']); // Cancel booking

    // Email routes
    Route::post('/re-send-pin', [EmailController::class, 'resend_email_pin']); // Resend email pin
    Route::post('/email/verify', [EmailController::class, 'verifyEmail']); // Verify email

    // Payment route
    Route::post('/payment', [PaymentController::class, 'create_payment']); // Create payment

    // User profile routes
    Route::get('/user', [ProfileController::class, 'user']); // Get user details
    Route::put('/user/{id}', [ProfileController::class, 'update']); // Update user profile
    Route::post('/updateProfile', [ProfileController::class, 'updateProfile']); // Update user profile

    // Review routes
    Route::post('/review', [ReviewController::class, 'store']); // Add review
    Route::get('/review/roomName', [ReviewController::class, 'getRoomName']); // Get room name for review
    Route::get('/review/user', [ReviewController::class, 'getUser']); // Get user's reviews
    Route::get('/review/reviews', [ReviewController::class, 'getReviews']); // Get all reviews

    // Message routes
    Route::get('/message', [MessageController::class, 'message']); // Get messages
    Route::get('/reservations', [MessageController::class, 'booking']); // Get reservations
});

// Public routes
Route::get('/rooms', [RoomController::class, 'getAllRooms']); // Get all rooms
Route::post('/contacts', [ContactController::class, 'store']); // Contact form submission
Route::get('/user-messages', [ContactController::class, 'getAllMessages']); // Get all user messages
Route::delete('/inbox/messages/{id}', [ContactController::class, 'deleteMessage']); // Delete message

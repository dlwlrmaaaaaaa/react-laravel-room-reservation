<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::get('/mail', function () {
    return view('mail');
});

// Route::get('/auth/callback', [AuthenticationController::class, 'handleAuthCallback']);
Route::get('/', function(){
    return "Hello Docker!";
});
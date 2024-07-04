<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;

class Room extends Model
{
    use HasFactory;
    protected $fillable = [
        'room_name',
        'price',
        'mini_description',
        'description',
        'room_amenities',
        'maximum_guest',
        'file_name'
    ];
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}

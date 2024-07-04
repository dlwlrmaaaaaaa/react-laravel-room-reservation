<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Room;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = [
        "room_id",
        'user_id',
        "starting_date",
        "ending_date",
        'status'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    
}

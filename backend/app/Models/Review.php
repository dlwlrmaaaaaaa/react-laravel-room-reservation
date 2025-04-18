<?php

namespace App\Models;

use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'room_id',
        'rating',
        'comment',
        'date_sent',
        'pictures'
    ];

    public function reviews()
    {
        return $this->hasMany(User::class);
    }
}

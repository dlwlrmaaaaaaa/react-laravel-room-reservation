<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMessage extends Model // Update the model name to singular form
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'user_messages', 'date'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inbox extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_email',
        'receiver_email',
        'message',
        'message_date',
        'message_sent',
        'message_received'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}

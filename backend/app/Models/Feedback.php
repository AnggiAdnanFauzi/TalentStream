<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'feedbacks';

    protected $fillable = [
        'id',
        'user_id',
        'user_name',
        'user_email',
        'tool_category',
        'rating',
        'feedback_type',
        'message',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'application_id', 'type', 'date_time',
        'interviewers', 'location_or_link', 'notes',
        'status', 'scorecard', 'recommendation'
    ];

    protected $casts = [
        'interviewers' => 'array',
        'scorecard' => 'array',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id', 'id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'application_id', 'title', 'due_date', 'assignee_id', 'status'
    ];

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id', 'id');
    }

    public function assignee()
    {
        return $this->belongsTo(Interviewer::class, 'assignee_id', 'id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'candidate_id', 'job_id', 'company_id', 'stage_id', 'applied_date',
        'scorecard', 'total_score', 'source', 'knocked_out',
        'notes', 'stage_history'
    ];

    protected $casts = [
        'scorecard' => 'array',
        'notes' => 'array',
        'stage_history' => 'array',
        'knocked_out' => 'boolean',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class, 'candidate_id', 'id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id', 'id');
    }

    public function stage()
    {
        return $this->belongsTo(Stage::class, 'stage_id', 'id');
    }

    public function interviews()
    {
        return $this->hasMany(Interview::class, 'application_id', 'id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'application_id', 'id');
    }
}

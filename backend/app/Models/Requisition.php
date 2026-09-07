<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Requisition extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'title', 'department', 'location', 'employment_type',
        'headcount', 'experience_level', 'salary_min', 'salary_max',
        'deadline', 'status', 'job_id', 'company_id'
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id', 'id');
    }
}

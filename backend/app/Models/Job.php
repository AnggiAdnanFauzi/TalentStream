<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $table = 'job_postings';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'title', 'department', 'level', 'location', 'status',
        'employment_type', 'total_applicants', 'days_open',
        'salary_min', 'salary_max', 'deadline', 'project_id',
        'company_id',
        'job_description', 'competencies', 'interview_questions'
    ];

    protected $casts = [
        'competencies' => 'array',
        'interview_questions' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id', 'id');
    }

    public function requisition()
    {
        return $this->hasOne(Requisition::class, 'job_id', 'id');
    }
}

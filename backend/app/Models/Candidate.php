<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'name', 'avatar_url', 'email', 'phone', 'experience_years',
        'expected_salary', 'portfolio_url', 'cv_url', 'address', 'date_of_birth',
        'major', 'skills', 'hobbies', 'aspirations', 'strengths', 'weaknesses', 'linkedin_url'
    ];

    public function applications()
    {
        return $this->hasMany(Application::class, 'candidate_id', 'id');
    }
}
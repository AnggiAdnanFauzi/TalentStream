<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'name', 'description', 'status', 'owner_id', 'company_id', 'created_date'];

    public function jobs()
    {
        return $this->hasMany(Job::class, 'project_id', 'id');
    }

    public function owner()
    {
        return $this->belongsTo(Interviewer::class, 'owner_id', 'id');
    }
}

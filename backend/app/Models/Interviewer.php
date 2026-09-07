<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interviewer extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'name', 'role'];

    public function projects()
    {
        return $this->hasMany(Project::class, 'owner_id', 'id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'assignee_id', 'id');
    }
}
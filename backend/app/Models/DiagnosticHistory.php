<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiagnosticHistory extends Model
{
    protected $fillable = [
        'user_id',
        'total_score',
        'grade',
        'net_cashflow',
        'runway_months',
        'inputs',
        'sub_scores',
        'action_plan',
    ];

    protected $casts = [
        'inputs' => 'array',
        'sub_scores' => 'array',
        'action_plan' => 'array',
        'total_score' => 'float',
        'net_cashflow' => 'float',
        'runway_months' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

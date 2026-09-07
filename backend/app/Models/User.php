<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public $incrementing = false;
    protected $keyType = "string";

    protected $fillable = [
        "id",
        "name",
        "company_name",
        "email",
        "phone",
        "avatar_url",
        "password",
        "role",
        "status", // active, archived
        "subscription",
        "referral_code",
        "referred_by",
    ];

    protected $hidden = [
        "password",
        "remember_token",
    ];

    protected function casts(): array
    {
        return [
            "email_verified_at" => "datetime",
            "password" => "hashed",
            "subscription" => "array",
        ];
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, "user_id", "id");
    }
}

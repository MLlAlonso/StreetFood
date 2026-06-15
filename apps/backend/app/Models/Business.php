<?php

namespace App\Models;
use App\Models\MenuItem;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $fillable = [
        'user_id',
        'business_type',
        'business_name',
        'logo',
        'description',
        'latitude',
        'longitude',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function menuItems()
    {
        return $this->hasMany( MenuItem::class);
    }
}
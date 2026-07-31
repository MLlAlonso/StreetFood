<?php

namespace App\Models;

use App\Models\MenuItem;
use App\Models\Favorite;
use App\Models\Review;
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
        'schedule_enabled',
        'manual_override',
        'manual_override_until',
    ];

    protected $casts = [
        'schedule_enabled' => 'boolean',
        'manual_override_until' => 'datetime',
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
        return $this->hasMany(MenuItem::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function hours()
    {
        return $this->hasMany(BusinessHour::class)
            ->orderBy('day_of_week');
    }
}

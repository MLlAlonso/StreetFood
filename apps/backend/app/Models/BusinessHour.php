<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class BusinessHour extends Model
{
    protected $fillable = [
        'business_id',
        'day_of_week',
        'enabled',
        'open_time',
        'close_time',
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'description',
        'image',
    ];

    public function business()
    {
        return $this->belongsTo( Business::class );
    }
}
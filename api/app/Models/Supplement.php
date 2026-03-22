<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplement extends Model
{
    protected $table = 'supplements';

    protected $fillable = [
        'plan_day_id',
        'name',
        'amount',
        'instructions',
        'image',
        'color',
        'order'
    ];

    public function planDay()
    {
        return $this->belongsTo(PlanDay::class, 'plan_day_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
 
    protected $table = 'meals';

    protected $fillable = [
        'plan_day_id',
        'name',
        'calories',
        'image',
        'order',
        'description'
    ];

    public function planDay()
    {
        return $this->belongsTo(PlanDay::class, 'plan_day_id');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanDay extends Model
{
    protected $table = 'plan_days';

    protected $fillable = [
        'diet_plan_id',
        'day'
    ];

    public function dietPlan()
    {
        return $this->belongsTo(DietPlan::class, 'diet_plan_id');
    }

    public function meals()
    {
        return $this->hasMany(Meal::class, 'plan_day_id');
    }

    public function supplements()
    {
        return $this->hasMany(Supplement::class, 'plan_day_id');
    }

}

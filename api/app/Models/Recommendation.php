<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    protected $table = 'recommendations';

    protected $fillable = [
        'diet_plan_id',
        'text',
        'order'
    ];

    public function dietPlan()
    {
        return $this->belongsTo(DietPlan::class, 'diet_plan_id');
    }
}

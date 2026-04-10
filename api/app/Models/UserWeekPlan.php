<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserWeekPlan extends Model
{
     protected $table ='user_week_plans';
     protected $fillable = [
        'user_id', 'day_index', 'type',
        'routine_id', 'user_routine_id', 'routine_name',
    ];
}

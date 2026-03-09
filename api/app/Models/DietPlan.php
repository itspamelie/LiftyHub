<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DietPlan extends Model
{
     protected $table = 'users';
    protected $fillable = [
        'nutritionist_id',
        'plan_content',
        'status'
    ];

}

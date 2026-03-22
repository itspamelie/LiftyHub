<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DietPlan extends Model
{
     protected $table = 'diet_plans';
    protected $fillable = [
        'nutritionist_id',
        'user_id',
        'is_monodiet',
        'status',
        'goal',
        'duration_days',
        'notes'
    ];
         public function  nutritionist(){
        return $this->hasOne(User::class,'id','nutritionist_id');
    }
            public function  user(){
        return $this->hasOne(User::class,'id','user_id');
    }
}

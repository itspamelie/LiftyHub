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
         public function  nutritionist(){
        return $this->hasOne(Nutritionist::class,'id','nutritionist_id');
    }
}

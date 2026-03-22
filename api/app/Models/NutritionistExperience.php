<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionistExperience extends Model
{
          protected $table = 'nutritionist_experiences';
    protected $fillable = [
        'nutritionist_profile_id',
        'title',
        'company',
        'start_year',
        'end_year'
    ];
         public function  nutritionist(){
        return $this->hasOne(NutritionistProfile::class,'id','nutritionist_profile_id');
    }
}

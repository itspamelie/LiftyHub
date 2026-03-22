<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionistEducation extends Model
{
        protected $table = 'nutritionist_educations';
    protected $fillable = [
        'nutritionist_profile_id',
        'degree',
        'institution',
        'year'
    ];
             public function  nutritionist(){
        return $this->hasOne(NutritionistProfile::class,'id','nutritionist_profile_id');
    }
}

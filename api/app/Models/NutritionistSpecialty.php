<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionistSpecialty extends Model
{
    protected $table = 'nutritionist_specialties';
    protected $fillable = [
        'nutritionist_profile_id',
        'specialty_id'
    ];
              public function  nutritionist(){
        return $this->hasOne(NutritionistProfile::class,'id','nutritionist_profile_id');
    }
                  public function  specialty(){
        return $this->hasOne(Specialty::class,'id','specialty_id');
    }
}

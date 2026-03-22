<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionistReview extends Model
{
        protected $table = 'nutritionist_reviews';
    protected $fillable = [
        'nutritionist_profile_id',
        'user_id',
        'rating',
        'comment'
    ];
              public function  nutritionist(){
        return $this->hasOne(NutritionistProfile::class,'id','nutritionist_profile_id');
    }
                  public function  user(){
        return $this->hasOne(User::class,'id','user_id');
    }
}

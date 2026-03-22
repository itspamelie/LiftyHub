<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionistProfile extends Model
{
     protected $table = 'nutritionist_profiles';
    protected $fillable = [
        'user_id',
        'license_number',
        'profile_pic',
        'specialty',
        'location',
        'bio',
        'rating',
        'reviews_count',
        'is_active'
    ];
      public function  user(){
        return $this->hasOne(User::class,'id','user_id');
    }
}

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

        public function education()
{
    return $this->hasMany(NutritionistEducation::class, 'nutritionist_profile_id');
}
    public function experience()
{
    return $this->hasMany(NutritionistExperience::class, 'nutritionist_profile_id');
}
public function specialties()
{
    return $this->belongsToMany(
        Specialty::class,
        'nutritionist_specialties',
        'nutritionist_profile_id',
        'specialty_id'
    );
}
public function reviews()
{
    return $this->hasMany(
        NutritionistReview::class,
        'nutritionist_profile_id'
    );
}
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionProfile extends Model
{
    protected $table = 'nutrition_profiles';

    protected $fillable = [
        'user_id',
        'weight',
        'age',
        'height',
        'meal_schedule',
        'favorite_foods',
        'disliked_foods',
        'allergies',
        'medical_restrictions',
        'favorite_meal',
        'can_cook_sunday'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
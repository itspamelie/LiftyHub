<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DietReview extends Model
{
      protected $table = 'diet_reviews';
    protected $fillable = [
        'diet_plan_id',
        'rating',
        'comment'
    ];
}

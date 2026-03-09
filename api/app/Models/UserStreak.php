<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStreak extends Model
{
     protected $table = 'user_streaks';
    protected $fillable = [
        'user_id',
        'current_streak',
        'longest_streak',
        'last_training_date'
    ];

      public function  user(){
        return $this->hasOne(User::class,'id','user_id');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyProgress extends Model
{
     protected $table = 'monthly_progress';
    protected $fillable = [
        'user_id',
        'year',
        'month_number',
        'initial_weight',
        'current_weight',
        'observations',
        'img'
    ];
     public function  user(){
        return $this->hasOne(User::class,'id','user_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExerciseLog extends Model
{
     protected $table = 'exercise_logs';
    protected $fillable = [
        'user_id',
        'exercise_id',
        'weight_lifted',
        'repetitions',
        'sets'
    ];
     public function  user(){
        return $this->hasOne(User::class,'id','user_id');
    }
         public function  exercise(){
        return $this->hasOne(Exercise::class,'id','exercise_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExerciseRoutine extends Model
{
     protected $table = 'exercise_routines';
    protected $fillable = [
        'routine_id',
        'exercise_id',
        'sets',
        'repetitions',
        'seconds_rest'
    ];
     public function  exercise(){
        return $this->hasOne(Exercise::class,'id','exercise_id');
    }
         public function  routine(){
        return $this->hasOne(Routine::class,'id','routine_id');
    }
}

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

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRoutineExercise extends Model
{
    protected $table = 'user_routine_exercises';

    protected $fillable = [
        'user_routine_id',
        'exercise_id',
        'sets',
        'repetitions',
        'seconds_rest',
    ];

    public function routine()
    {
        return $this->belongsTo(UserRoutine::class, 'user_routine_id');
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}

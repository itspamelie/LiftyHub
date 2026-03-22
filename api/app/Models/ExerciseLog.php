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
        'sets',
        'exercise_routine_id',
        'workout_date',
        'user_routine_session_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class, 'exercise_id');
    }

    public function exerciseRoutine()
    {
        return $this->belongsTo(ExerciseRoutine::class, 'exercise_routine_id');
    }

    public function session()
    {
        return $this->belongsTo(UserRoutineSession::class, 'user_routine_session_id');
    }
}

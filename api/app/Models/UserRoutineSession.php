<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRoutineSession extends Model
{
    protected $table = 'user_routine_sessions';

    protected $fillable = [
        'user_id',
        'routine_id',
        'user_routine_id',
        'started_at',
        'finished_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function routine()
    {
        return $this->belongsTo(Routine::class, 'routine_id');
    }

    public function userRoutine()
    {
        return $this->belongsTo(UserRoutine::class, 'user_routine_id');
    }

    public function logs()
    {
        return $this->hasMany(ExerciseLog::class, 'user_routine_session_id');
    }
}
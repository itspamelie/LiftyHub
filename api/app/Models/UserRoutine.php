<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRoutine extends Model
{
    protected $table = 'user_routines';

    protected $fillable = [
        'user_id',
        'name',
        'objective',
        'level',
        'duration',
        'img',
        'category'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function exercises()
    {
        return $this->hasMany(UserRoutineExercise::class, 'user_routine_id');
    }

    public function schedules()
    {
        return $this->hasMany(UserSchedule::class, 'user_routine_id');
    }

    public function sessions()
    {
        return $this->hasMany(UserRoutineSession::class, 'user_routine_id');
    }
}

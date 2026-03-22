<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSchedule extends Model
{
    protected $table = 'user_schedule';

    protected $fillable = [
        'user_id',
        'routine_id',
        'user_routine_id',
        'day_of_week'
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
}
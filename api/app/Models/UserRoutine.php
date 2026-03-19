<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRoutine extends Model
{
    protected $table = 'user_routines';

    protected $fillable = [
        'user_id',
        'name',
        'category',
        'objective',
        'level',
        'duration',
        'img',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exercises()
    {
        return $this->hasMany(UserRoutineExercise::class);
    }
}

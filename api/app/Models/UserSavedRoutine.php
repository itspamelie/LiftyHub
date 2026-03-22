<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSavedRoutine extends Model
{
    protected $table = 'user_saved_routines';

    protected $fillable = [
        'user_id',
        'routine_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function routine()
    {
        return $this->belongsTo(Routine::class, 'routine_id');
    }
}
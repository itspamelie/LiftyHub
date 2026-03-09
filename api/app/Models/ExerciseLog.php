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

}

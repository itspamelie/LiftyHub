<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExerciseFile extends Model
{
     protected $table = 'exercise_files';
    protected $fillable = [
        'exercise_id',
        'file_path',
        'type'
    ];

}

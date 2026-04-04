<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
     protected $table = 'exercises';
    protected $fillable = [
        'name',
        'muscle',
        'technique',
        'categorie'
    ];

public function exercise_files()
{
    return $this->hasMany(ExerciseFile::class);
}
}

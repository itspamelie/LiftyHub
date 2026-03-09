<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Routine extends Model
{
     protected $table = 'routines';
    protected $fillable = [
        'name',
        'objective',
        'level',
        'img',
        'plan_id',
        'somatotype_id'
    ];

}

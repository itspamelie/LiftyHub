<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Somatotype extends Model
{
     protected $table = 'somatotypes';
    protected $fillable = [
        'type',
        'description',
        'file'
    ];

}

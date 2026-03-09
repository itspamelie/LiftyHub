<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPropertie extends Model
{
     protected $table = 'user_properties';
    protected $fillable = [
        'user_id',
        'stature',
        'waist',
        'chest',
        'hips',
        'arms',
        'shoulders',
        'thighs',
        'objective',
        'somatotype_id'
    ];

      public function  user(){
        return $this->hasOne(User::class,'id','user_id');
    }
     public function  somatotype(){
        return $this->hasOne(Somatotype::class,'id','somatotype_id');
    }
}

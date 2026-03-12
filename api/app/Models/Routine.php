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
        'duration',
        'plan_id',
        'somatotype_id'
    ];
      public function  plan(){
        return $this->hasOne(Plan::class,'id','plan_id');
    }
     public function  somatotype(){
        return $this->hasOne(Somatotype::class,'id','somatotype_id');
    }
}

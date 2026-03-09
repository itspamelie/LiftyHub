<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
     protected $table = 'subscriptions';
    protected $fillable = [
        'user_id',
        'plan_id',
        'start_date',
        'end_date',
        'status'
    ];

          public function  user(){
        return $this->hasOne(User::class,'id','user_id');
    }
     public function  plan(){
        return $this->hasOne(Plan::class,'id','plan_id');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DietRequest extends Model
{
        protected $table = 'diet_requests';
        protected $fillable = [
        'user_id',
        'nutritionist_id',
        'year',
        'month',
        'status',
    ];

    //Usuario que solicita
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    //Nutriólogo seleccionado
    public function nutritionist()
    {
        return $this->belongsTo(User::class, 'nutritionist_id');
    }

    //Pago
    public function payment()
    {
        return $this->hasOne(DietPayment::class);
    }

    //Dieta final
    public function dietPlan()
    {
        return $this->hasOne(DietPlan::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DietPayment extends Model
{
      protected $table = 'diet_payments';
      protected $fillable = [
        'diet_request_id',
        'amount',
        'status',
        'payment_method',
    ];

    // Relación con la solicitud
    public function request()
    {
        return $this->belongsTo(DietRequest::class, 'diet_request_id');
    }
}

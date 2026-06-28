<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbandonedCart extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_phone',
        'customer_name',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];
}

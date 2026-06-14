<?php

return [
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
    'admin_email'  => env('ATHAR_ADMIN_EMAIL'),

    'shipping' => [
        'free_threshold' => (float) env('ATHAR_SHIPPING_FREE_THRESHOLD', 500),
        'fee'            => (float) env('ATHAR_SHIPPING_FEE', 35),
    ],

    'contact' => [
        'phone'    => env('ATHAR_CONTACT_PHONE', '+212 6 61 23 45 67'),
        'whatsapp' => env('ATHAR_WHATSAPP_NUMBER', '212661234567'),
        'email'    => env('ATHAR_CONTACT_EMAIL', 'contact@athar.ma'),
        'city'     => env('ATHAR_CONTACT_CITY', 'Tanger, Maroc'),
    ],
];

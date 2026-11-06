<?php

use App\Suppliers\ManualSupplier;
use App\Suppliers\SampleApiSupplier;

return [

    /*
    |--------------------------------------------------------------------------
    | Default supplier code
    |--------------------------------------------------------------------------
    |
    | Used when an order needs fulfillment and no supplier is assigned yet.
    |
    */
    'default' => env('SUPPLIER_DEFAULT', 'manual'),

    /*
    |--------------------------------------------------------------------------
    | Registered driver class map (documentation / validation helpers)
    |--------------------------------------------------------------------------
    */
    'drivers' => [
        'manual' => ManualSupplier::class,
        'sample_api' => SampleApiSupplier::class,
    ],

];

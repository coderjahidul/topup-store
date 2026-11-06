<?php

namespace App\Enums;

enum PaymentMethodCode: string
{
    case Wallet = 'wallet';
    case Bkash = 'bkash';
    case Nagad = 'nagad';
    case Rocket = 'rocket';
}

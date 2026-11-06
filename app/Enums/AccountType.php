<?php

namespace App\Enums;

enum AccountType: string
{
    case Personal = 'personal';
    case Agent = 'agent';
    case Merchant = 'merchant';
}

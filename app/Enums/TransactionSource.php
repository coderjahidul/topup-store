<?php

namespace App\Enums;

enum TransactionSource: string
{
    case AddMoney = 'add_money';
    case Order = 'order';
    case Refund = 'refund';
    case AdminAdjust = 'admin_adjust';
    case Cashback = 'cashback';
    case Referral = 'referral';
}

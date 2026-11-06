<?php

namespace App\Enums;

enum AddMoneyStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}

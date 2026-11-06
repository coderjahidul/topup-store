<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InvalidCouponException extends Exception
{
    public function render(Request $request): RedirectResponse
    {
        return back()->withErrors([
            'coupon_code' => $this->getMessage(),
        ]);
    }
}

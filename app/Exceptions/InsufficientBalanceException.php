<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InsufficientBalanceException extends Exception
{
    public function __construct(string $message = 'Insufficient wallet balance.')
    {
        parent::__construct($message);
    }

    public function render(Request $request): RedirectResponse
    {
        $message = app()->getLocale() === 'bn'
            ? 'ওয়ালেট ব্যালেন্স অপর্যাপ্ত।'
            : $this->getMessage();

        return back()->with('error', $message);
    }
}

<?php

namespace App\Support;

class Mask
{
    /**
     * Partially mask a person name for public feeds.
     */
    public static function name(?string $name): string
    {
        $name = trim((string) $name);

        if ($name === '') {
            return 'Guest';
        }

        $chars = mb_str_split($name);
        $length = count($chars);

        if ($length <= 2) {
            return $chars[0].'*';
        }

        if ($length === 3) {
            return $chars[0].'*'.$chars[2];
        }

        return $chars[0].$chars[1].str_repeat('*', max(1, $length - 3)).$chars[$length - 1];
    }

    /**
     * Partially mask a phone number.
     */
    public static function phone(?string $phone): string
    {
        $phone = preg_replace('/\D+/', '', (string) $phone) ?? '';

        if (strlen($phone) < 8) {
            return '01*******';
        }

        return substr($phone, 0, 3).'****'.substr($phone, -2);
    }
}

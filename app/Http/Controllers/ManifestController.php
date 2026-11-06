<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class ManifestController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $name = Setting::getValue('site_name', config('app.name'));

        return response()->json([
            'name' => $name,
            'short_name' => $name,
            'description' => 'Buy Free Fire Diamond, PUBG UC and more — Bangladesh top-up store.',
            'start_url' => '/',
            'display' => 'standalone',
            'background_color' => '#070b16',
            'theme_color' => '#070b16',
            'lang' => 'bn',
            'dir' => 'ltr',
            'icons' => [
                [
                    'src' => '/icons/icon-192.png',
                    'sizes' => '192x192',
                    'type' => 'image/png',
                    'purpose' => 'any maskable',
                ],
                [
                    'src' => '/icons/icon-512.png',
                    'sizes' => '512x512',
                    'type' => 'image/png',
                    'purpose' => 'any maskable',
                ],
            ],
        ]);
    }
}

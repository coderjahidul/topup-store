<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $base = rtrim((string) config('app.url'), '/');

        $urls = [
            ['loc' => $base.'/', 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => $base.'/track-order', 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => $base.'/pages/about', 'changefreq' => 'monthly', 'priority' => '0.4'],
            ['loc' => $base.'/pages/terms', 'changefreq' => 'monthly', 'priority' => '0.3'],
            ['loc' => $base.'/pages/privacy', 'changefreq' => 'monthly', 'priority' => '0.3'],
            ['loc' => $base.'/pages/refund', 'changefreq' => 'monthly', 'priority' => '0.3'],
            ['loc' => $base.'/pages/contact', 'changefreq' => 'monthly', 'priority' => '0.4'],
        ];

        Game::query()->active()->orderBy('sort_order')->get()->each(function (Game $game) use (&$urls, $base) {
            $urls[] = [
                'loc' => $base.'/games/'.$game->slug,
                'changefreq' => 'daily',
                'priority' => '0.8',
                'lastmod' => $game->updated_at?->toAtomString(),
            ];
        });

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}

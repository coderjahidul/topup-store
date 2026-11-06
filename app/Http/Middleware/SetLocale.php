<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Supported application locales.
     *
     * @var list<string>
     */
    public const SUPPORTED = ['bn', 'en'];

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->resolveLocale($request);

        App::setLocale($locale);
        $request->attributes->set('locale', $locale);

        $response = $next($request);

        cookie()->queue(cookie('locale', $locale, 60 * 24 * 365));

        return $response;
    }

    private function resolveLocale(Request $request): string
    {
        if ($request->user()?->locale && in_array($request->user()->locale, self::SUPPORTED, true)) {
            return $request->user()->locale;
        }

        $sessionLocale = $request->session()->get('locale');
        if (is_string($sessionLocale) && in_array($sessionLocale, self::SUPPORTED, true)) {
            return $sessionLocale;
        }

        $cookieLocale = $request->cookie('locale');
        if (is_string($cookieLocale) && in_array($cookieLocale, self::SUPPORTED, true)) {
            return $cookieLocale;
        }

        return config('app.locale', 'bn');
    }
}

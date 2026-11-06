<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'phone' => $request->user()->phone,
                    'locale' => $request->user()->locale,
                    'balance' => $request->user()->balance,
                    'referral_code' => $request->user()->referral_code,
                    'can_access_admin' => $request->user()->can('admin.access'),
                ] : null,
            ],
            'locale' => $locale,
            'availableLocales' => SetLocale::SUPPORTED,
            'translations' => $this->loadTranslations($locale),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'appName' => config('app.name'),
            'supportWhatsapp' => Setting::getValue('support_whatsapp'),
            'facebookLink' => Setting::getValue('facebook_link'),
            'seo' => [
                'base_url' => rtrim((string) config('app.url'), '/'),
                'default_title' => Setting::getValue('site_name', config('app.name')),
                'default_description' => Setting::getValue(
                    'seo_description',
                    'Buy Free Fire Diamond, PUBG UC, Mobile Legends Diamond — fast top-up in Bangladesh.',
                ),
                'og_image' => Setting::getValue('og_image', '/icons/icon-512.png'),
            ],
        ];
    }

    /**
     * Load JSON translation strings for the given locale.
     *
     * @return array<string, string>
     */
    private function loadTranslations(string $locale): array
    {
        $path = lang_path("{$locale}.json");

        if (! File::exists($path)) {
            return [];
        }

        /** @var array<string, string> $translations */
        $translations = json_decode(File::get($path), true) ?? [];

        return $translations;
    }
}

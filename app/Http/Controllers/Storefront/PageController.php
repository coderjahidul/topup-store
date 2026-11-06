<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Allowed static page slugs.
     *
     * @var list<string>
     */
    public const PAGES = [
        'about',
        'terms',
        'privacy',
        'refund',
        'contact',
    ];

    /**
     * Display an admin-editable static page.
     */
    public function show(Request $request, string $page): Response
    {
        abort_unless(in_array($page, self::PAGES, true), 404);

        $locale = app()->getLocale();
        $raw = Setting::getValue('page.'.$page);
        $content = $this->decodePage($raw, $locale);

        $titles = [
            'about' => ['bn' => 'আমাদের সম্পর্কে', 'en' => 'About Us'],
            'terms' => ['bn' => 'শর্তাবলী', 'en' => 'Terms of Service'],
            'privacy' => ['bn' => 'গোপনীয়তা নীতি', 'en' => 'Privacy Policy'],
            'refund' => ['bn' => 'রিফান্ড নীতি', 'en' => 'Refund Policy'],
            'contact' => ['bn' => 'যোগাযোগ', 'en' => 'Contact'],
        ];

        return Inertia::render('Static/Show', [
            'page' => $page,
            'title' => $titles[$page][$locale] ?? $titles[$page]['en'],
            'content' => $content,
            'supportWhatsapp' => Setting::getValue('support_whatsapp'),
            'facebookLink' => Setting::getValue('facebook_link'),
        ]);
    }

    private function decodePage(mixed $raw, string $locale): string
    {
        if (is_string($raw) && str_starts_with(trim($raw), '{')) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                return (string) ($decoded[$locale] ?? $decoded['en'] ?? '');
            }
        }

        return is_string($raw) ? $raw : '';
    }
}

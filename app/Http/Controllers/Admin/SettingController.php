<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Settings/Edit', [
            'settings' => [
                'site_name' => Setting::getValue('site_name', ''),
                'support_whatsapp' => Setting::getValue('support_whatsapp', ''),
                'facebook_link' => Setting::getValue('facebook_link', ''),
                'maintenance_mode' => Setting::getValue('maintenance', '0') === '1',
                'min_order_amount' => Setting::getValue('min_order_amount', '10'),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'support_whatsapp' => ['nullable', 'string', 'max:30'],
            'facebook_link' => ['nullable', 'string', 'max:500'],
            'maintenance_mode' => ['sometimes', 'boolean'],
            'min_order_amount' => ['required', 'numeric', 'min:0'],
        ]);

        Setting::setValue('site_name', $data['site_name']);
        Setting::setValue('support_whatsapp', $data['support_whatsapp'] ?? '');
        Setting::setValue('facebook_link', $data['facebook_link'] ?? '');
        Setting::setValue('maintenance', ! empty($data['maintenance_mode']) ? '1' : '0');
        Setting::setValue('min_order_amount', (string) $data['min_order_amount']);

        activity()->causedBy($request->user())->log('settings updated');

        return back()->with('success', 'Settings saved.');
    }
}

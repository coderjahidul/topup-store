<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Seed default site settings.
     */
    public function run(): void
    {
        $settings = [
            'site_name' => 'TopUp Store',
            'site_name_bn' => 'টপআপ স্টোর',
            'logo' => null,
            'favicon' => null,
            'support_whatsapp' => '8801XXXXXXXXX',
            'facebook_link' => 'https://facebook.com',
            'maintenance' => '0',
            'min_order_amount' => '10',
            'cashback_percent' => '0',
            'referral_bonus' => '0',
            'sms_enabled' => '0',
            'email_enabled' => '1',
        ];

        foreach ($settings as $key => $value) {
            Setting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }
    }
}

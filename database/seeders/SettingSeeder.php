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
            'support_whatsapp' => '8801712345678',
            'facebook_link' => 'https://facebook.com',
            'maintenance' => '0',
            'min_order_amount' => '10',
            'cashback_percent' => '0',
            'referral_bonus' => '0',
            'low_stock_threshold' => '5',
            'fraud_window_minutes' => '60',
            'fraud_max_orders_same_ip' => '5',
            'fraud_max_orders_same_uid' => '4',
            'fraud_max_orders_same_phone' => '4',
            'fraud_large_first_order_amount' => '2000',
            'seo_description' => 'Buy Free Fire Diamond, PUBG UC, Mobile Legends Diamond — fast top-up in Bangladesh.',
            'og_image' => '/icons/icon-512.png',
            'sms_enabled' => '0',
            'email_enabled' => '1',
            'flash_sale_ends_at' => now()->endOfDay()->toIso8601String(),
            'page.about' => json_encode([
                'bn' => "টপআপ স্টোর বাংলাদেশের গেমারদের জন্য একটি বিশ্বস্ত গেম কারেন্সি টপ-আপ প্ল্যাটফর্ম।\n\nআমরা ফ্রি ফায়ার, পাবজি মোবাইল ও মোবাইল লেজেন্ডসসহ জনপ্রিয় গেমের দ্রুত ডেলিভারি দিয়ে থাকি।",
                'en' => "TopUp Store is a trusted game currency top-up platform for gamers in Bangladesh.\n\nWe deliver Free Fire, PUBG Mobile, Mobile Legends and more with fast fulfillment.",
            ], JSON_UNESCAPED_UNICODE),
            'page.terms' => json_encode([
                'bn' => "১. সঠিক Player UID প্রদান ব্যবহারকারীর দায়িত্ব।\n২. ভুল UID-এর জন্য রিফান্ড প্রযোজ্য নাও হতে পারে।\n৩. সন্দেহজনক লেনদেন বাতিল করার অধিকার সংরক্ষিত।",
                'en' => "1. Providing the correct Player UID is the customer's responsibility.\n2. Refunds may not apply for wrong UID submissions.\n3. We reserve the right to cancel suspicious transactions.",
            ], JSON_UNESCAPED_UNICODE),
            'page.privacy' => json_encode([
                'bn' => 'আমরা আপনার নাম, ফোন ও অর্ডার তথ্য শুধুমাত্র সেবা প্রদানের জন্য সংরক্ষণ করি। তৃতীয় পক্ষের সাথে অপ্রয়োজনীয়ভাবে শেয়ার করা হয় না।',
                'en' => 'We store your name, phone and order details only to deliver the service. We do not unnecessarily share data with third parties.',
            ], JSON_UNESCAPED_UNICODE),
            'page.refund' => json_encode([
                'bn' => 'অর্ডার ব্যর্থ হলে ওয়ালেটে রিফান্ড বা ম্যানুয়াল রিফান্ড প্রক্রিয়া করা হয়। সফল ডেলিভারির পর রিফান্ড সাধারণত প্রযোজ্য নয়।',
                'en' => 'Failed orders are refunded to wallet or processed manually. Successful deliveries are generally non-refundable.',
            ], JSON_UNESCAPED_UNICODE),
            'page.contact' => json_encode([
                'bn' => "সাপোর্ট WhatsApp: 8801712345678\nইমেইল: support@example.com\nসময়: প্রতিদিন সকাল ১০টা – রাত ১২টা",
                'en' => "Support WhatsApp: 8801712345678\nEmail: support@example.com\nHours: Everyday 10:00 AM – 12:00 AM",
            ], JSON_UNESCAPED_UNICODE),
        ];

        foreach ($settings as $key => $value) {
            Setting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }
    }
}

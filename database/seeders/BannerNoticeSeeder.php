<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Notice;
use Illuminate\Database\Seeder;

class BannerNoticeSeeder extends Seeder
{
    /**
     * Seed demo banners and notices.
     */
    public function run(): void
    {
        Banner::query()->updateOrCreate(
            ['image' => 'banners/welcome.jpg'],
            [
                'title' => [
                    'bn' => 'স্বাগতম টপআপ স্টোরে',
                    'en' => 'Welcome to TopUp Store',
                ],
                'link' => '/',
                'sort_order' => 1,
                'is_active' => true,
            ],
        );

        Banner::query()->updateOrCreate(
            ['image' => 'banners/free-fire.jpg'],
            [
                'title' => [
                    'bn' => 'ফ্রি ফায়ার অফার',
                    'en' => 'Free Fire Offer',
                ],
                'link' => '/games/free-fire',
                'sort_order' => 2,
                'is_active' => true,
            ],
        );

        if (! Notice::query()->exists()) {
            Notice::query()->create([
                'message' => [
                    'bn' => 'সাধারণত অর্ডার ৫–১৫ মিনিটের মধ্যে সম্পন্ন হয়।',
                    'en' => 'Orders are usually completed within 5–15 minutes.',
                ],
                'is_active' => true,
            ]);
        }
    }
}

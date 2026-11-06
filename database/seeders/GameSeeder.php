<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Package;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Seed demo games and packages.
     */
    public function run(): void
    {
        $games = [
            [
                'slug' => 'free-fire',
                'name' => ['bn' => 'ফ্রি ফায়ার', 'en' => 'Free Fire'],
                'description' => [
                    'bn' => 'ফ্রি ফায়ার ডায়মন্ড টপ-আপ — দ্রুত ও নিরাপদ।',
                    'en' => 'Free Fire Diamond top-up — fast and secure.',
                ],
                'uid_label' => ['bn' => 'প্লেয়ার UID', 'en' => 'Player UID'],
                'requires_server' => false,
                'servers' => null,
                'sort_order' => 1,
                'packages' => [
                    ['bn' => '১০০ ডায়মন্ড', 'en' => '100 Diamonds', 'price' => 80, 'discount' => 75, 'cost' => 65],
                    ['bn' => '৩১০ ডায়মন্ড', 'en' => '310 Diamonds', 'price' => 240, 'discount' => 225, 'cost' => 195],
                    ['bn' => '৫২০ ডায়মন্ড', 'en' => '520 Diamonds', 'price' => 400, 'discount' => 380, 'cost' => 330],
                    ['bn' => '১০৮০ ডায়মন্ড', 'en' => '1080 Diamonds', 'price' => 800, 'discount' => 760, 'cost' => 660],
                ],
            ],
            [
                'slug' => 'pubg-mobile',
                'name' => ['bn' => 'পাবজি মোবাইল', 'en' => 'PUBG Mobile'],
                'description' => [
                    'bn' => 'পাবজি মোবাইল UC টপ-আপ।',
                    'en' => 'PUBG Mobile UC top-up.',
                ],
                'uid_label' => ['bn' => 'ক্যারেক্টার আইডি', 'en' => 'Character ID'],
                'requires_server' => false,
                'servers' => null,
                'sort_order' => 2,
                'packages' => [
                    ['bn' => '৬০ UC', 'en' => '60 UC', 'price' => 95, 'discount' => 90, 'cost' => 78],
                    ['bn' => '৩২৫ UC', 'en' => '325 UC', 'price' => 480, 'discount' => 455, 'cost' => 400],
                    ['bn' => '৬৬০ UC', 'en' => '660 UC', 'price' => 950, 'discount' => 900, 'cost' => 790],
                    ['bn' => '১৮০০ UC', 'en' => '1800 UC', 'price' => 2400, 'discount' => 2280, 'cost' => 2000],
                ],
            ],
            [
                'slug' => 'mobile-legends',
                'name' => ['bn' => 'মোবাইল লেজেন্ডস', 'en' => 'Mobile Legends'],
                'description' => [
                    'bn' => 'মোবাইল লেজেন্ডস ডায়মন্ড টপ-আপ।',
                    'en' => 'Mobile Legends Diamond top-up.',
                ],
                'uid_label' => ['bn' => 'ইউজার আইডি', 'en' => 'User ID'],
                'requires_server' => true,
                'servers' => ['Server 1', 'Server 2', 'Server 3', 'Server 4', 'Server 5'],
                'sort_order' => 3,
                'packages' => [
                    ['bn' => '৮৬ ডায়মন্ড', 'en' => '86 Diamonds', 'price' => 120, 'discount' => 110, 'cost' => 95],
                    ['bn' => '১৭২ ডায়মন্ড', 'en' => '172 Diamonds', 'price' => 230, 'discount' => 215, 'cost' => 185],
                    ['bn' => '২৫৭ ডায়মন্ড', 'en' => '257 Diamonds', 'price' => 340, 'discount' => 320, 'cost' => 275],
                    ['bn' => '৭০৬ ডায়মন্ড', 'en' => '706 Diamonds', 'price' => 900, 'discount' => 850, 'cost' => 740],
                ],
            ],
        ];

        foreach ($games as $index => $gameData) {
            $packages = $gameData['packages'];
            unset($gameData['packages']);

            $game = Game::query()->updateOrCreate(
                ['slug' => $gameData['slug']],
                [
                    ...$gameData,
                    'is_active' => true,
                ],
            );

            foreach ($packages as $packageIndex => $package) {
                Package::query()->updateOrCreate(
                    [
                        'game_id' => $game->id,
                        'supplier_code' => strtoupper($game->slug).'-'.($packageIndex + 1),
                    ],
                    [
                        'name' => ['bn' => $package['bn'], 'en' => $package['en']],
                        'price' => $package['price'],
                        'discount_price' => $package['discount'],
                        'reseller_price' => round($package['discount'] * 0.97, 2),
                        'cost_price' => $package['cost'],
                        'stock' => null,
                        'is_active' => true,
                        'sort_order' => $packageIndex + 1,
                    ],
                );
            }
        }
    }
}

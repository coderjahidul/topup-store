<?php

namespace Database\Seeders;

use App\Enums\CouponType;
use App\Models\Coupon;
use App\Models\Game;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Seed sample coupons.
     */
    public function run(): void
    {
        Coupon::query()->updateOrCreate(
            ['code' => 'WELCOME10'],
            [
                'type' => CouponType::Percent,
                'value' => 10,
                'min_order_amount' => 100,
                'max_discount' => 50,
                'usage_limit' => 1000,
                'used_count' => 0,
                'per_user_limit' => 1,
                'starts_at' => now()->subDay(),
                'expires_at' => now()->addMonths(3),
                'applicable_game_id' => null,
                'first_order_only' => true,
                'is_active' => true,
            ],
        );

        Coupon::query()->updateOrCreate(
            ['code' => 'FLAT20'],
            [
                'type' => CouponType::Fixed,
                'value' => 20,
                'min_order_amount' => 200,
                'max_discount' => null,
                'usage_limit' => 500,
                'used_count' => 0,
                'per_user_limit' => 2,
                'starts_at' => now()->subDay(),
                'expires_at' => now()->addMonths(2),
                'applicable_game_id' => null,
                'first_order_only' => false,
                'is_active' => true,
            ],
        );

        $freeFire = Game::query()->where('slug', 'free-fire')->first();

        if ($freeFire) {
            Coupon::query()->updateOrCreate(
                ['code' => 'FF50'],
                [
                    'type' => CouponType::Fixed,
                    'value' => 50,
                    'min_order_amount' => 300,
                    'max_discount' => null,
                    'usage_limit' => 200,
                    'used_count' => 0,
                    'per_user_limit' => 1,
                    'starts_at' => now()->subDay(),
                    'expires_at' => now()->addMonth(),
                    'applicable_game_id' => $freeFire->id,
                    'first_order_only' => false,
                    'is_active' => true,
                ],
            );
        }
    }
}

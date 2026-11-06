<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethodCode;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Package;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoFeedSeeder extends Seeder
{
    /**
     * Seed recent orders and reviews for the storefront.
     */
    public function run(): void
    {
        $packages = Package::query()->with('game')->active()->limit(6)->get();

        if ($packages->isEmpty()) {
            return;
        }

        foreach ($packages as $index => $package) {
            $order = Order::query()->create([
                'order_number' => 'ORD-'.now()->format('Ymd').'-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                'user_id' => null,
                'guest_name' => fake()->name(),
                'guest_phone' => '017'.str_pad((string) (10000000 + $index), 8, '0', STR_PAD_LEFT),
                'guest_email' => null,
                'game_id' => $package->game_id,
                'package_id' => $package->id,
                'player_uid' => (string) fake()->numerify('##########'),
                'server' => $package->game?->requires_server ? 'Server 1' : null,
                'player_name' => fake()->userName(),
                'quantity' => 1,
                'amount' => $package->sellingPrice(),
                'discount_amount' => 0,
                'coupon_id' => null,
                'final_amount' => $package->sellingPrice(),
                'payment_method' => PaymentMethodCode::Bkash,
                'payment_status' => PaymentStatus::Paid,
                'trx_id' => 'DEMO'.strtoupper(fake()->unique()->bothify('######')),
                'sender_number' => '018'.str_pad((string) (20000000 + $index), 8, '0', STR_PAD_LEFT),
                'status' => $index < 4 ? OrderStatus::Completed : OrderStatus::Processing,
                'completed_at' => $index < 4 ? now()->subMinutes($index * 7) : null,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'DemoSeeder',
            ]);

            if ($order->status === OrderStatus::Completed) {
                Review::query()->updateOrCreate(
                    ['order_id' => $order->id],
                    [
                        'user_id' => null,
                        'name' => $order->guest_name,
                        'rating' => fake()->numberBetween(4, 5),
                        'comment' => fake()->randomElement([
                            'খুব দ্রুত ডেলিভারি পেয়েছি!',
                            'Super fast top-up, recommended.',
                            'সার্ভিস ভালো, আবার নিব।',
                        ]),
                        'is_approved' => true,
                    ],
                );
            }
        }

        User::factory()->create([
            'name' => 'Demo Customer',
            'phone' => '01611112222',
            'email' => 'customer@example.com',
        ]);
    }
}

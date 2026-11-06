<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethodCode;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = 100;

        return [
            'order_number' => 'ORD-'.now()->format('Ymd').'-'.fake()->unique()->numerify('####'),
            'user_id' => User::factory(),
            'guest_name' => null,
            'guest_phone' => null,
            'guest_email' => null,
            'package_id' => Package::factory(),
            'game_id' => fn (array $attributes) => Package::query()->find($attributes['package_id'])?->game_id,
            'player_uid' => fake()->numerify('##########'),
            'server' => null,
            'player_name' => fake()->userName(),
            'quantity' => 1,
            'amount' => $amount,
            'discount_amount' => 0,
            'coupon_id' => null,
            'final_amount' => $amount,
            'payment_method' => PaymentMethodCode::Bkash,
            'payment_status' => PaymentStatus::Pending,
            'trx_id' => strtoupper(fake()->unique()->bothify('TRX########')),
            'sender_number' => '01'.fake()->numerify('#########'),
            'status' => OrderStatus::Pending,
            'supplier_id' => null,
            'supplier_order_ref' => null,
            'admin_note' => null,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'completed_at' => null,
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Order $order): void {
            if ($order->package_id) {
                $package = Package::query()->find($order->package_id);

                if ($package) {
                    $order->game_id = $package->game_id;
                    $order->amount = $package->sellingPrice();
                    $order->final_amount = $package->sellingPrice();
                }
            }
        })->afterCreating(function (Order $order): void {
            if ($order->package_id && (! $order->game_id || (float) $order->amount === 100.0)) {
                $package = Package::query()->find($order->package_id);

                if ($package) {
                    $order->forceFill([
                        'game_id' => $package->game_id,
                        'amount' => $package->sellingPrice(),
                        'final_amount' => $package->sellingPrice(),
                    ])->saveQuietly();
                }
            }
        });
    }

    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'guest_name' => fake()->name(),
            'guest_phone' => '01'.fake()->numerify('#########'),
            'guest_email' => fake()->optional()->safeEmail(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Completed,
            'payment_status' => PaymentStatus::Paid,
            'completed_at' => now(),
        ]);
    }

    public function forPackage(Package $package): static
    {
        return $this->state(fn (array $attributes) => [
            'game_id' => $package->game_id,
            'package_id' => $package->id,
            'amount' => $package->sellingPrice(),
            'final_amount' => $package->sellingPrice(),
        ]);
    }
}

<?php

namespace Tests\Feature;

use App\Enums\CouponType;
use App\Exceptions\InvalidCouponException;
use App\Models\Coupon;
use App\Models\Game;
use App\Models\Package;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Services\CouponService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CouponServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_percent_coupon_applies_with_max_discount_cap(): void
    {
        $game = Game::factory()->create();
        Coupon::factory()->create([
            'code' => 'SAVE10',
            'type' => CouponType::Percent,
            'value' => 10,
            'min_order_amount' => 50,
            'max_discount' => 30,
            'is_active' => true,
        ]);

        $result = DB::transaction(fn () => app(CouponService::class)->calculateDiscount(
            'save10',
            500,
            $game,
        ));

        $this->assertSame(30.0, $result['discount']);
    }

    public function test_first_order_only_coupon_rejects_repeat_customer(): void
    {
        $user = User::factory()->create();
        $game = Game::factory()->create(['is_active' => true]);
        $package = Package::factory()->for($game)->create(['is_active' => true, 'price' => 100]);
        PaymentMethod::factory()->create(['code' => 'bkash', 'is_active' => true]);

        $this->actingAs($user)->post(route('orders.store', $game), [
            'package_id' => $package->id,
            'player_uid' => '1231231231',
            'payment_method' => 'bkash',
            'sender_number' => '01711111111',
            'trx_id' => 'FIRSTORDER1',
            'idempotency_token' => 'first-order-token',
        ])->assertRedirect();

        Coupon::factory()->create([
            'code' => 'WELCOME10',
            'type' => CouponType::Percent,
            'value' => 10,
            'first_order_only' => true,
            'is_active' => true,
            'min_order_amount' => 0,
        ]);

        $this->expectException(InvalidCouponException::class);

        DB::transaction(fn () => app(CouponService::class)->calculateDiscount(
            'WELCOME10',
            100,
            $game,
            $user->fresh(),
        ));
    }

    public function test_expired_coupon_is_rejected(): void
    {
        $game = Game::factory()->create();
        Coupon::factory()->create([
            'code' => 'OLD50',
            'expires_at' => now()->subDay(),
            'is_active' => true,
        ]);

        $this->expectException(InvalidCouponException::class);

        DB::transaction(fn () => app(CouponService::class)->calculateDiscount('OLD50', 200, $game));
    }
}

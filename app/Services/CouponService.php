<?php

namespace App\Services;

use App\Enums\CouponType;
use App\Enums\OrderStatus;
use App\Exceptions\InvalidCouponException;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Game;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CouponService
{
    /**
     * Validate a coupon and return the discount amount for an order subtotal.
     *
     * @return array{coupon: Coupon, discount: float}
     */
    public function calculateDiscount(
        string $code,
        float $subtotal,
        Game $game,
        ?User $user = null,
        ?string $phone = null,
    ): array {
        $coupon = Coupon::query()
            ->where('code', strtoupper(trim($code)))
            ->lockForUpdate()
            ->first();

        if (! $coupon || ! $coupon->is_active) {
            throw new InvalidCouponException($this->message('কুপনটি অবৈধ বা নিষ্ক্রিয়।', 'Invalid or inactive coupon.'));
        }

        if ($coupon->starts_at && $coupon->starts_at->isFuture()) {
            throw new InvalidCouponException($this->message('কুপন এখনো সক্রিয় হয়নি।', 'This coupon is not active yet.'));
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            throw new InvalidCouponException($this->message('কুপনের মেয়াদ শেষ।', 'This coupon has expired.'));
        }

        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            throw new InvalidCouponException($this->message('কুপনের ব্যবহার সীমা শেষ।', 'Coupon usage limit reached.'));
        }

        if ($coupon->applicable_game_id && $coupon->applicable_game_id !== $game->id) {
            throw new InvalidCouponException($this->message('এই কুপন এই গেমের জন্য প্রযোজ্য নয়।', 'Coupon is not valid for this game.'));
        }

        if ($subtotal < (float) $coupon->min_order_amount) {
            throw new InvalidCouponException($this->message('মিনিমাম অর্ডার অ্যামাউন্ট পূরণ হয়নি।', 'Minimum order amount not met.'));
        }

        if ($coupon->first_order_only && $this->hasPriorOrder($user, $phone)) {
            throw new InvalidCouponException($this->message('এই কুপন শুধু প্রথম অর্ডারে প্রযোজ্য।', 'Coupon is for first order only.'));
        }

        if ($this->usageCount($coupon, $user, $phone) >= $coupon->per_user_limit) {
            throw new InvalidCouponException($this->message('আপনি এই কুপন আর ব্যবহার করতে পারবেন না।', 'You have already used this coupon.'));
        }

        $discount = $coupon->type === CouponType::Percent
            ? round($subtotal * ((float) $coupon->value / 100), 2)
            : round((float) $coupon->value, 2);

        if ($coupon->max_discount !== null) {
            $discount = min($discount, (float) $coupon->max_discount);
        }

        $discount = min($discount, $subtotal);

        return [
            'coupon' => $coupon,
            'discount' => round($discount, 2),
        ];
    }

    public function recordUsage(Coupon $coupon, Order $order, ?User $user = null, ?string $phone = null): CouponUsage
    {
        return DB::transaction(function () use ($coupon, $order, $user, $phone) {
            /** @var Coupon $locked */
            $locked = Coupon::query()->whereKey($coupon->id)->lockForUpdate()->firstOrFail();
            $locked->increment('used_count');

            return CouponUsage::query()->create([
                'coupon_id' => $locked->id,
                'order_id' => $order->id,
                'user_id' => $user?->id,
                'phone' => $phone,
            ]);
        });
    }

    private function hasPriorOrder(?User $user, ?string $phone): bool
    {
        $query = Order::query()->whereNotIn('status', [OrderStatus::Cancelled, OrderStatus::Failed]);

        if ($user) {
            return $query->where('user_id', $user->id)->exists();
        }

        if ($phone) {
            return $query->where('guest_phone', $phone)->exists();
        }

        return false;
    }

    private function usageCount(Coupon $coupon, ?User $user, ?string $phone): int
    {
        $query = CouponUsage::query()->where('coupon_id', $coupon->id);

        if ($user) {
            return $query->where('user_id', $user->id)->count();
        }

        if ($phone) {
            return $query->where('phone', $phone)->count();
        }

        return 0;
    }

    private function message(string $bn, string $en): string
    {
        return app()->getLocale() === 'bn' ? $bn : $en;
    }
}

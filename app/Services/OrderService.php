<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethodCode;
use App\Enums\PaymentStatus;
use App\Enums\TransactionSource;
use App\Enums\UserStatus;
use App\Exceptions\InsufficientBalanceException;
use App\Jobs\CheckLowStockJob;
use App\Models\Game;
use App\Models\Order;
use App\Models\Package;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class OrderService
{
    public function __construct(
        private WalletService $walletService,
        private CouponService $couponService,
        private PaymentVerificationService $paymentVerification,
        private NotificationService $notificationService,
        private SupplierService $supplierService,
    ) {}

    /**
     * Create a guest or authenticated order.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(Game $game, array $data, ?User $user = null): Order
    {
        if ($user?->status === UserStatus::Blocked) {
            throw ValidationException::withMessages([
                'player_uid' => app()->getLocale() === 'bn'
                    ? 'আপনার অ্যাকাউন্ট ব্লক করা হয়েছে।'
                    : 'Your account is blocked.',
            ]);
        }

        return DB::transaction(function () use ($game, $data, $user) {
            $token = (string) $data['idempotency_token'];

            $existing = Order::query()->where('idempotency_token', $token)->first();
            if ($existing) {
                return $existing;
            }

            /** @var Package $package */
            $package = Package::query()
                ->whereKey($data['package_id'])
                ->where('game_id', $game->id)
                ->active()
                ->lockForUpdate()
                ->firstOrFail();

            if ($package->stock !== null) {
                if ($package->stock < 1) {
                    throw ValidationException::withMessages([
                        'package_id' => app()->getLocale() === 'bn'
                            ? 'স্টক শেষ।'
                            : 'Out of stock.',
                    ]);
                }

                $package->decrement('stock');
            }

            $quantity = max(1, (int) ($data['quantity'] ?? 1));
            $unitPrice = (float) ($package->discount_price ?? $package->price);
            $amount = round($unitPrice * $quantity, 2);
            $discount = 0.0;
            $coupon = null;

            if (! empty($data['coupon_code'])) {
                $result = $this->couponService->calculateDiscount(
                    (string) $data['coupon_code'],
                    $amount,
                    $game,
                    $user,
                    $user?->phone ?? ($data['guest_phone'] ?? null),
                );
                $coupon = $result['coupon'];
                $discount = $result['discount'];
            }

            $finalAmount = round(max(0, $amount - $discount), 2);
            $paymentMethod = PaymentMethodCode::from((string) $data['payment_method']);

            $trxId = null;
            if ($paymentMethod !== PaymentMethodCode::Wallet) {
                try {
                    $trxId = $this->paymentVerification->normalizeTrxId($data['trx_id'] ?? null);
                    if (! $trxId) {
                        throw ValidationException::withMessages([
                            'trx_id' => app()->getLocale() === 'bn' ? 'TrxID আবশ্যক।' : 'TrxID is required.',
                        ]);
                    }
                    $this->paymentVerification->assertUniqueTrxId($trxId);
                } catch (InvalidArgumentException $exception) {
                    throw ValidationException::withMessages([
                        'trx_id' => $exception->getMessage(),
                    ]);
                }
            }

            if ($paymentMethod === PaymentMethodCode::Wallet && ! $user) {
                throw ValidationException::withMessages([
                    'payment_method' => app()->getLocale() === 'bn'
                        ? 'ওয়ালেট পেমেন্টের জন্য লগইন করুন।'
                        : 'Login required for wallet payment.',
                ]);
            }

            $order = Order::query()->create([
                'order_number' => $this->generateOrderNumber(),
                'idempotency_token' => $token,
                'user_id' => $user?->id,
                'guest_name' => $user ? null : ($data['guest_name'] ?? null),
                'guest_phone' => $user ? null : ($data['guest_phone'] ?? null),
                'guest_email' => $user ? null : ($data['guest_email'] ?? null),
                'game_id' => $game->id,
                'package_id' => $package->id,
                'player_uid' => (string) $data['player_uid'],
                'server' => $data['server'] ?? null,
                'player_name' => $data['player_name'] ?? null,
                'quantity' => $quantity,
                'amount' => $amount,
                'discount_amount' => $discount,
                'coupon_id' => $coupon?->id,
                'final_amount' => $finalAmount,
                'payment_method' => $paymentMethod,
                'payment_status' => PaymentStatus::Pending,
                'trx_id' => $trxId,
                'sender_number' => $data['sender_number'] ?? null,
                'status' => OrderStatus::Pending,
                'ip_address' => $data['ip_address'] ?? null,
                'user_agent' => $data['user_agent'] ?? null,
            ]);

            if ($coupon) {
                $this->couponService->recordUsage(
                    $coupon,
                    $order,
                    $user,
                    $user?->phone ?? ($data['guest_phone'] ?? null),
                );
            }

            if ($paymentMethod === PaymentMethodCode::Wallet) {
                try {
                    $this->walletService->debit(
                        $user,
                        $finalAmount,
                        TransactionSource::Order,
                        $order,
                        null,
                        'Order '.$order->order_number,
                    );
                } catch (InsufficientBalanceException $exception) {
                    throw $exception;
                }

                $order->forceFill([
                    'payment_status' => PaymentStatus::Paid,
                    'status' => OrderStatus::Processing,
                ])->save();

                $this->supplierService->assignDefaultSupplier($order);
            }

            if ($user) {
                $user->forceFill([
                    'last_player_uid' => (string) $data['player_uid'],
                ])->save();
            }

            $this->notificationService->orderPlaced($order);

            if ($package->stock !== null) {
                $threshold = (int) Setting::getValue('low_stock_threshold', 5);
                if ($package->fresh()->stock <= $threshold) {
                    DB::afterCommit(fn () => CheckLowStockJob::dispatch());
                }
            }

            if ($order->fresh()->status === OrderStatus::Processing) {
                DB::afterCommit(fn () => $this->supplierService->dispatchFulfillment($order->fresh()));
            }

            return $order->fresh(['game', 'package']);
        });
    }

    /**
     * Mark an order failed and refund wallet payments once.
     */
    public function failAndRefund(Order $order, ?string $adminNote = null): Order
    {
        return DB::transaction(function () use ($order, $adminNote) {
            /** @var Order $locked */
            $locked = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            if (in_array($locked->status, [OrderStatus::Failed, OrderStatus::Refunded, OrderStatus::Cancelled], true)) {
                return $locked;
            }

            if (
                $locked->payment_method === PaymentMethodCode::Wallet
                && $locked->payment_status === PaymentStatus::Paid
                && $locked->user_id
            ) {
                $user = User::query()->whereKey($locked->user_id)->lockForUpdate()->firstOrFail();
                $this->walletService->credit(
                    $user,
                    $locked->final_amount,
                    TransactionSource::Refund,
                    $locked,
                    null,
                    'Refund for '.$locked->order_number,
                );

                $locked->forceFill([
                    'payment_status' => PaymentStatus::Refunded,
                    'status' => OrderStatus::Refunded,
                    'admin_note' => $adminNote,
                ])->save();
            } else {
                $locked->forceFill([
                    'status' => OrderStatus::Failed,
                    'payment_status' => $locked->payment_status === PaymentStatus::Paid
                        ? PaymentStatus::Refunded
                        : PaymentStatus::Failed,
                    'admin_note' => $adminNote,
                ])->save();
            }

            $this->notificationService->orderFailed($locked->fresh());

            return $locked->fresh();
        });
    }

    public function markProcessing(Order $order, bool $dispatchSupplier = false): Order
    {
        $updated = DB::transaction(function () use ($order) {
            /** @var Order $locked */
            $locked = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            if ($locked->status !== OrderStatus::Pending) {
                return $locked;
            }

            $locked->forceFill(['status' => OrderStatus::Processing])->save();
            $this->supplierService->assignDefaultSupplier($locked);

            return $locked->fresh();
        });

        if ($dispatchSupplier && $updated->status === OrderStatus::Processing && ! $updated->supplier_order_ref) {
            $this->supplierService->dispatchFulfillment($updated);
        }

        return $updated;
    }

    public function complete(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            /** @var Order $locked */
            $locked = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            if ($locked->status === OrderStatus::Completed) {
                return $locked;
            }

            $locked->forceFill([
                'status' => OrderStatus::Completed,
                'payment_status' => PaymentStatus::Paid,
                'completed_at' => now(),
            ])->save();

            $this->notificationService->orderCompleted($locked->fresh());

            return $locked->fresh();
        });
    }

    public function cancel(Order $order, ?string $adminNote = null): Order
    {
        return DB::transaction(function () use ($order, $adminNote) {
            /** @var Order $locked */
            $locked = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            if (in_array($locked->status, [
                OrderStatus::Completed,
                OrderStatus::Cancelled,
                OrderStatus::Refunded,
            ], true)) {
                return $locked;
            }

            if (
                $locked->payment_method === PaymentMethodCode::Wallet
                && $locked->payment_status === PaymentStatus::Paid
                && $locked->user_id
            ) {
                $user = User::query()->whereKey($locked->user_id)->lockForUpdate()->firstOrFail();
                $this->walletService->credit(
                    $user,
                    $locked->final_amount,
                    TransactionSource::Refund,
                    $locked,
                    null,
                    'Cancel refund for '.$locked->order_number,
                );

                $locked->forceFill([
                    'payment_status' => PaymentStatus::Refunded,
                    'status' => OrderStatus::Cancelled,
                    'admin_note' => $adminNote,
                ])->save();
            } else {
                $locked->forceFill([
                    'status' => OrderStatus::Cancelled,
                    'admin_note' => $adminNote,
                ])->save();
            }

            return $locked->fresh();
        });
    }

    public function updateAdminNote(Order $order, string $note): Order
    {
        $order->forceFill(['admin_note' => $note])->save();

        return $order->fresh();
    }

    /**
     * Find a public order by number + phone for tracking.
     */
    public function findForTracking(string $orderNumber, string $phone): ?Order
    {
        $order = Order::query()
            ->with(['game', 'package', 'user'])
            ->where('order_number', strtoupper(trim($orderNumber)))
            ->first();

        if (! $order) {
            return null;
        }

        $expected = $order->user_id
            ? $order->user?->phone
            : $order->guest_phone;

        if (! $expected || $expected !== $phone) {
            return null;
        }

        return $order;
    }

    private function generateOrderNumber(): string
    {
        do {
            $number = 'ORD-'.now()->format('Ymd').'-'.str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (Order::query()->where('order_number', $number)->exists());

        return $number;
    }
}

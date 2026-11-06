<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethodCode;
use App\Enums\PaymentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'order_number',
    'user_id',
    'guest_name',
    'guest_phone',
    'guest_email',
    'game_id',
    'package_id',
    'player_uid',
    'server',
    'player_name',
    'quantity',
    'amount',
    'discount_amount',
    'coupon_id',
    'final_amount',
    'payment_method',
    'payment_status',
    'trx_id',
    'sender_number',
    'status',
    'supplier_id',
    'supplier_order_ref',
    'admin_note',
    'ip_address',
    'user_agent',
    'completed_at',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'quantity' => 1,
        'discount_amount' => 0,
        'payment_status' => 'unpaid',
        'status' => 'pending',
    ];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'final_amount' => 'decimal:2',
            'payment_method' => PaymentMethodCode::class,
            'payment_status' => PaymentStatus::class,
            'status' => OrderStatus::class,
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function couponUsage(): HasOne
    {
        return $this->hasOne(CouponUsage::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function supplierLogs(): HasMany
    {
        return $this->hasMany(SupplierLog::class);
    }

    public function customerPhone(): ?string
    {
        return $this->user?->phone ?? $this->guest_phone;
    }

    public function customerName(): ?string
    {
        return $this->user?->name ?? $this->guest_name;
    }

    #[Scope]
    protected function pending(Builder $query): Builder
    {
        return $query->where('status', OrderStatus::Pending);
    }

    #[Scope]
    protected function completed(Builder $query): Builder
    {
        return $query->where('status', OrderStatus::Completed);
    }
}

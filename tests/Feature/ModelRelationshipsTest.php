<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\TransactionType;
use App\Enums\UserStatus;
use App\Models\Coupon;
use App\Models\Game;
use App\Models\Order;
use App\Models\Package;
use App\Models\PaymentMethod;
use App\Models\Setting;
use App\Models\Supplier;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    public function test_game_has_packages_and_translatable_name(): void
    {
        $game = Game::factory()->create([
            'name' => ['bn' => 'ফ্রি ফায়ার', 'en' => 'Free Fire'],
        ]);
        $package = Package::factory()->for($game)->create();

        $this->assertTrue($game->packages->contains($package));
        $this->assertSame('Free Fire', $game->getTranslation('name', 'en'));
        $this->assertSame('ফ্রি ফায়ার', $game->getTranslation('name', 'bn'));
    }

    public function test_order_belongs_to_user_game_and_package(): void
    {
        $user = User::factory()->create();
        $package = Package::factory()->create();
        $order = Order::factory()->for($user)->forPackage($package)->create();

        $this->assertTrue($order->user->is($user));
        $this->assertTrue($order->package->is($package));
        $this->assertTrue($order->game->is($package->game));
        $this->assertSame(OrderStatus::Pending, $order->status);
        $this->assertSame(PaymentStatus::Pending, $order->payment_status);
    }

    public function test_guest_order_stores_guest_contact_fields(): void
    {
        $order = Order::factory()->guest()->create();

        $this->assertNull($order->user_id);
        $this->assertNotNull($order->guest_phone);
        $this->assertSame($order->guest_phone, $order->customerPhone());
    }

    public function test_wallet_transaction_ledger_is_immutable(): void
    {
        $transaction = WalletTransaction::factory()->create([
            'type' => TransactionType::Credit,
            'amount' => 100,
        ]);

        $updated = $transaction->update(['amount' => 999]);
        $deleted = $transaction->delete();

        $this->assertFalse($updated);
        $this->assertFalse($deleted);
        $this->assertSame('100.00', $transaction->fresh()->amount);
    }

    public function test_user_status_and_balance_casts(): void
    {
        $user = User::factory()->withBalance(250.5)->create();

        $this->assertSame(UserStatus::Active, $user->status);
        $this->assertSame('250.50', $user->balance);
        $this->assertTrue($user->isActive());
    }

    public function test_database_seeder_creates_demo_catalog(): void
    {
        $this->seed();

        $this->assertDatabaseHas('users', ['email' => 'admin@example.com']);
        $this->assertTrue(Game::query()->where('slug', 'free-fire')->exists());
        $this->assertTrue(Package::query()->whereHas('game', fn ($q) => $q->where('slug', 'pubg-mobile'))->exists());
        $this->assertTrue(PaymentMethod::query()->where('code', 'bkash')->exists());
        $this->assertTrue(Coupon::query()->where('code', 'WELCOME10')->exists());
        $this->assertTrue(Supplier::query()->where('code', 'manual')->exists());
        $this->assertSame('TopUp Store', Setting::getValue('site_name'));
    }
}

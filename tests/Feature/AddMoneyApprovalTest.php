<?php

namespace Tests\Feature;

use App\Enums\AddMoneyStatus;
use App\Enums\TransactionSource;
use App\Models\AddMoneyRequest;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Services\AddMoneyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AddMoneyApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_submit_add_money_request(): void
    {
        $user = User::factory()->create();
        $method = PaymentMethod::factory()->create([
            'code' => 'bkash',
            'is_active' => true,
            'min_amount' => 10,
            'max_amount' => 50000,
        ]);

        $this->actingAs($user)
            ->post(route('wallet.add-money.store'), [
                'payment_method_id' => $method->id,
                'amount' => 500,
                'sender_number' => '01712345678',
                'trx_id' => 'addmoney001',
            ])
            ->assertRedirect(route('wallet.add-money'));

        $this->assertDatabaseHas('add_money_requests', [
            'user_id' => $user->id,
            'amount' => '500.00',
            'trx_id' => 'ADDMONEY001',
            'status' => AddMoneyStatus::Pending->value,
        ]);
    }

    public function test_admin_approval_credits_wallet_once(): void
    {
        $user = User::factory()->withBalance(0)->create();
        $admin = User::factory()->create();
        Role::findOrCreate('admin', 'web');
        $admin->assignRole('admin');

        $method = PaymentMethod::factory()->create(['is_active' => true]);
        $request = AddMoneyRequest::factory()->create([
            'user_id' => $user->id,
            'payment_method_id' => $method->id,
            'amount' => 250,
            'status' => AddMoneyStatus::Pending,
            'trx_id' => 'APPROVE250',
        ]);

        /** @var AddMoneyService $service */
        $service = app(AddMoneyService::class);
        $service->approve($request, $admin, 'Looks good');
        $service->approve($request->fresh(), $admin, 'Looks good again');

        $this->assertSame('250.00', $user->fresh()->balance);
        $this->assertSame(AddMoneyStatus::Approved, $request->fresh()->status);
        $this->assertDatabaseCount('wallet_transactions', 1);
        $this->assertDatabaseHas('wallet_transactions', [
            'user_id' => $user->id,
            'source' => TransactionSource::AddMoney->value,
            'amount' => '250.00',
        ]);
    }

    public function test_duplicate_trx_id_is_rejected_on_add_money(): void
    {
        $user = User::factory()->create();
        $method = PaymentMethod::factory()->create(['is_active' => true]);

        AddMoneyRequest::factory()->create([
            'payment_method_id' => $method->id,
            'trx_id' => 'DUPTRX999',
        ]);

        $this->actingAs($user)
            ->from(route('wallet.add-money'))
            ->post(route('wallet.add-money.store'), [
                'payment_method_id' => $method->id,
                'amount' => 100,
                'sender_number' => '01712345678',
                'trx_id' => 'duptrx999',
            ])
            ->assertSessionHasErrors('trx_id');
    }
}

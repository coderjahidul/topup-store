<?php

namespace Tests\Feature;

use App\Enums\AddMoneyStatus;
use App\Models\AddMoneyRequest;
use App\Models\PaymentMethod;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAddMoneyHttpTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_add_money_via_http(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $user = User::factory()->withBalance(0)->create();
        $method = PaymentMethod::factory()->create(['is_active' => true]);
        $request = AddMoneyRequest::factory()->create([
            'user_id' => $user->id,
            'payment_method_id' => $method->id,
            'amount' => 300,
            'status' => AddMoneyStatus::Pending,
            'trx_id' => 'HTTPAPPROVE1',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.add-money.approve', $request), ['note' => 'OK'])
            ->assertRedirect();

        $this->assertSame(AddMoneyStatus::Approved, $request->fresh()->status);
        $this->assertSame('300.00', $user->fresh()->balance);
    }
}

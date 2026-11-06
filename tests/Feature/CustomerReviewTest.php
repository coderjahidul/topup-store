<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_review_completed_order_once(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->for($user)->create([
            'status' => OrderStatus::Completed,
            'payment_status' => PaymentStatus::Paid,
            'completed_at' => now(),
        ]);

        $this->actingAs($user)
            ->post(route('customer.reviews.store', $order), [
                'rating' => 5,
                'comment' => 'Fast delivery',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('reviews', [
            'order_id' => $order->id,
            'user_id' => $user->id,
            'rating' => 5,
            'is_approved' => false,
        ]);

        $this->actingAs($user)
            ->from(route('customer.orders.show', $order))
            ->post(route('customer.reviews.store', $order), [
                'rating' => 4,
                'comment' => 'Again',
            ])
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertSame(1, Review::query()->count());
    }

    public function test_pending_order_cannot_be_reviewed(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->for($user)->create([
            'status' => OrderStatus::Pending,
        ]);

        $this->actingAs($user)
            ->post(route('customer.reviews.store', $order), [
                'rating' => 5,
            ])
            ->assertStatus(422);
    }
}

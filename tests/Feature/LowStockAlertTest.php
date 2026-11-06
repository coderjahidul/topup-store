<?php

namespace Tests\Feature;

use App\Jobs\CheckLowStockJob;
use App\Jobs\SendNotificationJob;
use App\Models\Package;
use App\Models\Setting;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class LowStockAlertTest extends TestCase
{
    use RefreshDatabase;

    public function test_check_low_stock_job_queues_notification(): void
    {
        Queue::fake([SendNotificationJob::class]);

        Setting::setValue('low_stock_threshold', '5');

        Package::factory()->create([
            'stock' => 2,
            'is_active' => true,
        ]);

        (new CheckLowStockJob)->handle(app(NotificationService::class));

        Queue::assertPushed(SendNotificationJob::class, function (SendNotificationJob $job) {
            return $job->event === 'stock.low';
        });
    }
}

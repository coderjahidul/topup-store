<?php

namespace App\Jobs;

use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;

class SendNotificationJob implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    /**
     * @param  array<string, mixed>  $payload
     */
    public function __construct(
        public string $event,
        public array $payload = [],
        public ?string $locale = null,
    ) {}

    public function handle(NotificationService $notifications): void
    {
        $notifications->deliver($this->event, $this->payload, $this->locale);
    }
}

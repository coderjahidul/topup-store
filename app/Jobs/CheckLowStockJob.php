<?php

namespace App\Jobs;

use App\Models\Package;
use App\Models\Setting;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CheckLowStockJob implements ShouldQueue
{
    use Queueable;

    public function handle(NotificationService $notifications): void
    {
        $threshold = (int) Setting::getValue('low_stock_threshold', 5);

        $lowStock = Package::query()
            ->with('game')
            ->whereNotNull('stock')
            ->where('is_active', true)
            ->where('stock', '<=', $threshold)
            ->orderBy('stock')
            ->get();

        if ($lowStock->isEmpty()) {
            return;
        }

        $notifications->stockAlert($lowStock, $threshold);
    }
}

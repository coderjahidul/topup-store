<?php

namespace App\Suppliers;

use App\Models\Order;
use App\Models\Supplier;
use App\Suppliers\Contracts\SupplierInterface;

/**
 * Default driver — no remote API. Admin fulfills manually.
 */
class ManualSupplier implements SupplierInterface
{
    public function placeOrder(Order $order, Supplier $supplier, array $credentials = []): SupplierResult
    {
        $request = [
            'action' => 'placeOrder',
            'driver' => 'manual',
            'order_number' => $order->order_number,
            'player_uid' => $order->player_uid,
            'package_id' => $order->package_id,
            'supplier_code' => $order->package?->supplier_code,
        ];

        return SupplierResult::ok(
            status: 'awaiting_manual',
            request: $request,
            response: [
                'message' => 'Queued for manual fulfillment. No remote API call was made.',
            ],
            reference: 'MANUAL-'.$order->order_number,
            message: 'Awaiting manual top-up',
        );
    }

    public function checkStatus(Order $order, Supplier $supplier, array $credentials = []): SupplierResult
    {
        $request = [
            'action' => 'checkStatus',
            'order_number' => $order->order_number,
            'supplier_order_ref' => $order->supplier_order_ref,
        ];

        return SupplierResult::ok(
            status: $order->status->value,
            request: $request,
            response: [
                'local_status' => $order->status->value,
                'message' => 'Manual supplier has no remote status; using local order status.',
            ],
            reference: $order->supplier_order_ref,
        );
    }

    public function getBalance(Supplier $supplier, array $credentials = []): SupplierResult
    {
        $request = ['action' => 'getBalance', 'supplier' => $supplier->code];

        return SupplierResult::ok(
            status: 'ok',
            request: $request,
            response: ['balance' => (float) $supplier->balance_cache],
            balance: (float) $supplier->balance_cache,
            message: 'Manual balance cache',
        );
    }

    public function verifyPlayer(
        string $playerUid,
        ?string $server,
        string $supplierCode,
        Supplier $supplier,
        array $credentials = [],
    ): SupplierResult {
        $request = [
            'action' => 'verifyPlayer',
            'player_uid' => $playerUid,
            'server' => $server,
            'supplier_code' => $supplierCode,
        ];

        return SupplierResult::ok(
            status: 'unverified',
            request: $request,
            response: [
                'verified' => false,
                'message' => 'Manual driver does not verify player names remotely.',
            ],
            message: 'Skipped remote verification',
        );
    }
}

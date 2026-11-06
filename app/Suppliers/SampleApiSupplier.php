<?php

namespace App\Suppliers;

use App\Models\Order;
use App\Models\Supplier;
use App\Suppliers\Contracts\SupplierInterface;
use Illuminate\Support\Str;

/**
 * Stub API supplier — simulates remote calls without hitting a real network.
 * Toggle failure via credentials.force_fail or credentials.fail_rate (0-100).
 */
class SampleApiSupplier implements SupplierInterface
{
    public function placeOrder(Order $order, Supplier $supplier, array $credentials = []): SupplierResult
    {
        $request = [
            'action' => 'placeOrder',
            'endpoint' => '/v1/orders',
            'api_key_present' => ! empty($credentials['api_key']),
            'order_number' => $order->order_number,
            'player_uid' => $order->player_uid,
            'server' => $order->server,
            'sku' => $order->package?->supplier_code,
            'amount' => $order->final_amount,
        ];

        if ($this->shouldFail($credentials)) {
            return SupplierResult::fail(
                status: 'api_error',
                request: $request,
                response: [
                    'error' => 'SAMPLE_API_TEMPORARY_ERROR',
                    'message' => 'Simulated upstream failure',
                ],
                message: 'Sample API temporary failure',
                shouldRetry: true,
            );
        }

        $reference = 'SAMPLE-'.strtoupper(Str::random(10));

        return SupplierResult::ok(
            status: 'accepted',
            request: $request,
            response: [
                'supplier_ref' => $reference,
                'state' => 'processing',
            ],
            reference: $reference,
            message: 'Accepted by sample API',
        );
    }

    public function checkStatus(Order $order, Supplier $supplier, array $credentials = []): SupplierResult
    {
        $request = [
            'action' => 'checkStatus',
            'endpoint' => '/v1/orders/'.$order->supplier_order_ref,
            'supplier_ref' => $order->supplier_order_ref,
        ];

        if ($this->shouldFail($credentials)) {
            return SupplierResult::fail(
                status: 'api_error',
                request: $request,
                response: ['error' => 'SAMPLE_API_STATUS_UNAVAILABLE'],
                message: 'Sample API status check failed',
                shouldRetry: true,
            );
        }

        return SupplierResult::ok(
            status: 'completed',
            request: $request,
            response: [
                'supplier_ref' => $order->supplier_order_ref,
                'state' => 'success',
            ],
            reference: $order->supplier_order_ref,
            message: 'Sample API reports success',
        );
    }

    public function getBalance(Supplier $supplier, array $credentials = []): SupplierResult
    {
        $request = [
            'action' => 'getBalance',
            'endpoint' => '/v1/balance',
            'api_key_present' => ! empty($credentials['api_key']),
        ];

        $balance = isset($credentials['demo_balance'])
            ? (float) $credentials['demo_balance']
            : (float) ($supplier->balance_cache ?: 10000);

        return SupplierResult::ok(
            status: 'ok',
            request: $request,
            response: ['balance' => $balance, 'currency' => 'BDT'],
            balance: $balance,
            message: 'Sample API balance',
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
            'endpoint' => '/v1/players/verify',
            'player_uid' => $playerUid,
            'server' => $server,
            'sku' => $supplierCode,
        ];

        if (strlen($playerUid) < 5) {
            return SupplierResult::fail(
                status: 'invalid_player',
                request: $request,
                response: ['valid' => false],
                message: 'Player UID too short',
            );
        }

        return SupplierResult::ok(
            status: 'verified',
            request: $request,
            response: [
                'valid' => true,
                'player_name' => 'SamplePlayer_'.substr($playerUid, -4),
            ],
            message: 'Player verified (stub)',
        );
    }

    /**
     * @param  array<string, mixed>  $credentials
     */
    private function shouldFail(array $credentials): bool
    {
        if (! empty($credentials['force_fail'])) {
            return true;
        }

        $failRate = (int) ($credentials['fail_rate'] ?? 0);

        if ($failRate <= 0) {
            return false;
        }

        return random_int(1, 100) <= min(100, $failRate);
    }
}

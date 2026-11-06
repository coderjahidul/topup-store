<?php

namespace App\Services;

use App\Jobs\ProcessSupplierOrderJob;
use App\Models\Order;
use App\Models\Supplier;
use App\Models\SupplierLog;
use App\Suppliers\Contracts\SupplierInterface;
use App\Suppliers\ManualSupplier;
use App\Suppliers\SampleApiSupplier;
use App\Suppliers\SupplierResult;
use InvalidArgumentException;
use RuntimeException;

class SupplierService
{
    public function resolve(Supplier $supplier): SupplierInterface
    {
        $driver = $supplier->driver;

        if (! is_string($driver) || $driver === '' || ! class_exists($driver)) {
            throw new InvalidArgumentException("Unknown supplier driver [{$driver}].");
        }

        $instance = app($driver);

        if (! $instance instanceof SupplierInterface) {
            throw new RuntimeException("Driver [{$driver}] must implement SupplierInterface.");
        }

        return $instance;
    }

    public function defaultSupplier(): ?Supplier
    {
        $code = (string) config('suppliers.default', 'manual');

        return Supplier::query()->active()->where('code', $code)->first()
            ?? Supplier::query()->active()->orderBy('id')->first();
    }

    public function assignDefaultSupplier(Order $order): Order
    {
        if ($order->supplier_id) {
            return $order;
        }

        $supplier = $this->defaultSupplier();

        if (! $supplier) {
            return $order;
        }

        $order->forceFill(['supplier_id' => $supplier->id])->save();

        return $order->fresh();
    }

    public function dispatchFulfillment(Order $order): void
    {
        $order = $this->assignDefaultSupplier($order);

        if (! $order->supplier_id) {
            return;
        }

        ProcessSupplierOrderJob::dispatch($order->id);
    }

    public function placeOrder(Order $order): SupplierResult
    {
        $order->loadMissing(['package', 'supplier']);

        $supplier = $order->supplier ?? $this->defaultSupplier();

        if (! $supplier) {
            return SupplierResult::fail(
                status: 'no_supplier',
                request: ['order_id' => $order->id],
                response: [],
                message: 'No active supplier configured',
            );
        }

        if (! $order->supplier_id) {
            $order->forceFill(['supplier_id' => $supplier->id])->save();
        }

        $driver = $this->resolve($supplier);
        $credentials = $supplier->credentials ?? [];

        $result = $driver->placeOrder($order->fresh(['package']), $supplier, $credentials);
        $this->logCall($order, $supplier, $result);

        if ($result->success && $result->reference) {
            $order->forceFill(['supplier_order_ref' => $result->reference])->save();
        }

        return $result;
    }

    public function checkStatus(Order $order): SupplierResult
    {
        $order->loadMissing(['supplier', 'package']);
        $supplier = $order->supplier;

        if (! $supplier) {
            return SupplierResult::fail(
                status: 'no_supplier',
                request: ['order_id' => $order->id],
                message: 'Order has no supplier',
            );
        }

        $result = $this->resolve($supplier)->checkStatus($order, $supplier, $supplier->credentials ?? []);
        $this->logCall($order, $supplier, $result);

        return $result;
    }

    public function syncBalance(Supplier $supplier): SupplierResult
    {
        $result = $this->resolve($supplier)->getBalance($supplier, $supplier->credentials ?? []);

        SupplierLog::query()->create([
            'order_id' => null,
            'supplier_id' => $supplier->id,
            'request' => $result->request,
            'response' => $result->response,
            'status' => $result->success ? 'success' : 'failed',
        ]);

        if ($result->success && $result->balance !== null) {
            $supplier->forceFill(['balance_cache' => $result->balance])->save();
        }

        return $result;
    }

    public function verifyPlayer(Order $order): SupplierResult
    {
        $order->loadMissing(['package', 'supplier']);
        $supplier = $order->supplier ?? $this->defaultSupplier();

        if (! $supplier) {
            return SupplierResult::fail(status: 'no_supplier', message: 'No supplier');
        }

        $result = $this->resolve($supplier)->verifyPlayer(
            $order->player_uid,
            $order->server,
            (string) ($order->package?->supplier_code ?? ''),
            $supplier,
            $supplier->credentials ?? [],
        );

        $this->logCall($order, $supplier, $result);

        return $result;
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public function availableDrivers(): array
    {
        return [
            ['value' => ManualSupplier::class, 'label' => 'Manual'],
            ['value' => SampleApiSupplier::class, 'label' => 'Sample API (stub)'],
        ];
    }

    private function logCall(Order $order, Supplier $supplier, SupplierResult $result): void
    {
        SupplierLog::query()->create([
            'order_id' => $order->id,
            'supplier_id' => $supplier->id,
            'request' => $result->request,
            'response' => array_filter([
                ...$result->response,
                'message' => $result->message,
                'reference' => $result->reference,
            ], fn ($value) => $value !== null),
            'status' => $result->success ? 'success' : 'failed',
        ]);
    }
}

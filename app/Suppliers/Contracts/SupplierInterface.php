<?php

namespace App\Suppliers\Contracts;

use App\Models\Order;
use App\Models\Supplier;
use App\Suppliers\SupplierResult;

interface SupplierInterface
{
    /**
     * Place a top-up order with the supplier.
     *
     * @param  array<string, mixed>  $credentials
     */
    public function placeOrder(Order $order, Supplier $supplier, array $credentials = []): SupplierResult;

    /**
     * Check remote order status.
     *
     * @param  array<string, mixed>  $credentials
     */
    public function checkStatus(Order $order, Supplier $supplier, array $credentials = []): SupplierResult;

    /**
     * Fetch supplier wallet/balance.
     *
     * @param  array<string, mixed>  $credentials
     */
    public function getBalance(Supplier $supplier, array $credentials = []): SupplierResult;

    /**
     * Optionally verify a player UID before checkout.
     *
     * @param  array<string, mixed>  $credentials
     */
    public function verifyPlayer(
        string $playerUid,
        ?string $server,
        string $supplierCode,
        Supplier $supplier,
        array $credentials = [],
    ): SupplierResult;
}

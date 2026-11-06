<?php

namespace App\Suppliers;

class SupplierResult
{
    /**
     * @param  array<string, mixed>  $request
     * @param  array<string, mixed>  $response
     */
    public function __construct(
        public readonly bool $success,
        public readonly string $status,
        public readonly array $request = [],
        public readonly array $response = [],
        public readonly ?string $reference = null,
        public readonly ?string $message = null,
        public readonly ?float $balance = null,
        public readonly bool $shouldRetry = false,
    ) {}

    /**
     * @param  array<string, mixed>  $request
     * @param  array<string, mixed>  $response
     */
    public static function ok(
        string $status,
        array $request = [],
        array $response = [],
        ?string $reference = null,
        ?string $message = null,
        ?float $balance = null,
    ): self {
        return new self(
            success: true,
            status: $status,
            request: $request,
            response: $response,
            reference: $reference,
            message: $message,
            balance: $balance,
            shouldRetry: false,
        );
    }

    /**
     * @param  array<string, mixed>  $request
     * @param  array<string, mixed>  $response
     */
    public static function fail(
        string $status,
        array $request = [],
        array $response = [],
        ?string $message = null,
        bool $shouldRetry = false,
    ): self {
        return new self(
            success: false,
            status: $status,
            request: $request,
            response: $response,
            message: $message,
            shouldRetry: $shouldRetry,
        );
    }
}

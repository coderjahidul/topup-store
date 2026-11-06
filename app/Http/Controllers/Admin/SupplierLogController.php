<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupplierLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierLogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $supplierId = $request->integer('supplier_id') ?: null;
        $orderId = $request->integer('order_id') ?: null;

        $logs = SupplierLog::query()
            ->with(['supplier', 'order'])
            ->when($supplierId, fn ($q) => $q->where('supplier_id', $supplierId))
            ->when($orderId, fn ($q) => $q->where('order_id', $orderId))
            ->latest('id')
            ->paginate(30)
            ->withQueryString()
            ->through(fn (SupplierLog $log) => [
                'id' => $log->id,
                'status' => $log->status,
                'supplier' => $log->supplier?->name,
                'order_number' => $log->order?->order_number,
                'request' => $log->request,
                'response' => $log->response,
                'created_at' => $log->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Suppliers/Logs', [
            'logs' => $logs,
            'filters' => [
                'supplier_id' => $supplierId,
                'order_id' => $orderId,
            ],
        ]);
    }
}

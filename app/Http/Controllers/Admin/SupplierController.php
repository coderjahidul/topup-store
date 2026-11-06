<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSupplierRequest;
use App\Models\Supplier;
use App\Services\SupplierService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function __construct(private SupplierService $supplierService) {}

    public function index(): Response
    {
        $suppliers = Supplier::query()
            ->withCount('logs')
            ->orderBy('name')
            ->paginate(20)
            ->through(fn (Supplier $supplier) => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'code' => $supplier->code,
                'driver' => class_basename($supplier->driver),
                'driver_class' => $supplier->driver,
                'balance_cache' => $supplier->balance_cache,
                'is_active' => $supplier->is_active,
                'logs_count' => $supplier->logs_count,
            ]);

        return Inertia::render('Admin/Suppliers/Index', [
            'suppliers' => $suppliers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Suppliers/Form', [
            'supplier' => null,
            'drivers' => $this->supplierService->availableDrivers(),
            'mode' => 'create',
        ]);
    }

    public function store(StoreSupplierRequest $request): RedirectResponse
    {
        $data = $this->prepare($request->validated());
        $supplier = Supplier::query()->create($data);
        activity()->causedBy($request->user())->performedOn($supplier)->log('supplier created');

        return redirect()->route('admin.suppliers.index')->with('success', 'Supplier created.');
    }

    public function edit(Supplier $supplier): Response
    {
        return Inertia::render('Admin/Suppliers/Form', [
            'supplier' => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'code' => $supplier->code,
                'driver' => $supplier->driver,
                'is_active' => $supplier->is_active,
                'balance_cache' => $supplier->balance_cache,
                // Never send secrets — only whether credentials exist.
                'has_credentials' => ! empty($supplier->credentials),
                'credentials_json' => '',
            ],
            'drivers' => $this->supplierService->availableDrivers(),
            'mode' => 'edit',
        ]);
    }

    public function update(StoreSupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        $data = $this->prepare($request->validated(), $supplier);
        $supplier->update($data);
        activity()->causedBy($request->user())->performedOn($supplier)->log('supplier updated');

        return redirect()->route('admin.suppliers.index')->with('success', 'Supplier updated.');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        if ($supplier->code === 'manual') {
            return back()->with('error', 'Cannot delete the default manual supplier.');
        }

        $supplier->delete();

        return redirect()->route('admin.suppliers.index')->with('success', 'Supplier deleted.');
    }

    public function syncBalance(Supplier $supplier): RedirectResponse
    {
        $result = $this->supplierService->syncBalance($supplier);

        return back()->with(
            $result->success ? 'success' : 'error',
            $result->success
                ? 'Balance synced: '.number_format((float) $result->balance, 2)
                : ($result->message ?? 'Balance sync failed'),
        );
    }

    public function toggle(Request $request, Supplier $supplier): RedirectResponse
    {
        $supplier->update([
            'is_active' => $request->boolean('is_active', ! $supplier->is_active),
        ]);

        return back()->with('success', 'Supplier updated.');
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function prepare(array $data, ?Supplier $existing = null): array
    {
        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        if (! empty($data['credentials_json'])) {
            $decoded = json_decode((string) $data['credentials_json'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $data['credentials'] = $decoded;
            }
        } elseif ($existing) {
            unset($data['credentials']);
        } else {
            $data['credentials'] = [];
        }

        unset($data['credentials_json']);

        return $data;
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsTranslatable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePaymentMethodRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    use TransformsTranslatable;

    public function index(): Response
    {
        $methods = PaymentMethod::query()
            ->orderBy('sort_order')
            ->paginate(20)
            ->through(fn (PaymentMethod $method) => [
                'id' => $method->id,
                'name' => $method->name,
                'code' => $method->code,
                'account_number' => $method->account_number,
                'account_type' => $method->account_type->value,
                'min_amount' => $method->min_amount,
                'max_amount' => $method->max_amount,
                'is_active' => $method->is_active,
                'sort_order' => $method->sort_order,
            ]);

        return Inertia::render('Admin/PaymentMethods/Index', [
            'paymentMethods' => $methods,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PaymentMethods/Form', [
            'paymentMethod' => null,
            'mode' => 'create',
        ]);
    }

    public function store(StorePaymentMethodRequest $request): RedirectResponse
    {
        PaymentMethod::query()->create($this->prepare($request->validated()));

        return redirect()->route('admin.payment-methods.index')->with('success', 'Payment method created.');
    }

    public function edit(PaymentMethod $paymentMethod): Response
    {
        return Inertia::render('Admin/PaymentMethods/Form', [
            'paymentMethod' => [
                'id' => $paymentMethod->id,
                'name' => $paymentMethod->name,
                'code' => $paymentMethod->code,
                'account_number' => $paymentMethod->account_number,
                'account_type' => $paymentMethod->account_type->value,
                'logo' => $paymentMethod->logo,
                'min_amount' => $paymentMethod->min_amount,
                'max_amount' => $paymentMethod->max_amount,
                'charge_percent' => $paymentMethod->charge_percent,
                'sort_order' => $paymentMethod->sort_order,
                'is_active' => $paymentMethod->is_active,
                ...$this->flattenTranslations($paymentMethod, ['instruction']),
            ],
            'mode' => 'edit',
        ]);
    }

    public function update(StorePaymentMethodRequest $request, PaymentMethod $paymentMethod): RedirectResponse
    {
        $paymentMethod->update($this->prepare($request->validated()));

        return redirect()->route('admin.payment-methods.index')->with('success', 'Payment method updated.');
    }

    public function destroy(PaymentMethod $paymentMethod): RedirectResponse
    {
        $paymentMethod->delete();

        return redirect()->route('admin.payment-methods.index')->with('success', 'Payment method deleted.');
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function prepare(array $data): array
    {
        $data = $this->mapTranslations($data, ['instruction']);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);
        $data['charge_percent'] = (float) ($data['charge_percent'] ?? 0);

        return $data;
    }
}

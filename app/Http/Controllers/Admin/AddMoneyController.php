<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AddMoneyRequest;
use App\Services\AddMoneyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddMoneyController extends Controller
{
    public function __construct(private AddMoneyService $addMoneyService) {}

    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $requests = AddMoneyRequest::query()
            ->with(['user', 'paymentMethod', 'admin'])
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (AddMoneyRequest $item) => [
                'id' => $item->id,
                'amount' => $item->amount,
                'trx_id' => $item->trx_id,
                'sender_number' => $item->sender_number,
                'status' => $item->status->value,
                'user_name' => $item->user?->name,
                'user_phone' => $item->user?->phone,
                'payment_method' => $item->paymentMethod?->name,
                'admin_note' => $item->admin_note,
                'created_at' => $item->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/AddMoney/Index', [
            'requests' => $requests,
            'filters' => ['status' => $status],
        ]);
    }

    public function approve(Request $request, AddMoneyRequest $addMoneyRequest): RedirectResponse
    {
        $note = $request->input('admin_note') ?: $request->input('note');
        $this->addMoneyService->approve($addMoneyRequest, $request->user(), $note ? (string) $note : null);
        activity()->causedBy($request->user())->performedOn($addMoneyRequest)->log('add money approved');

        return back()->with('success', 'Add money approved.');
    }

    public function reject(Request $request, AddMoneyRequest $addMoneyRequest): RedirectResponse
    {
        $note = $request->input('admin_note') ?: $request->input('note');
        $this->addMoneyService->reject($addMoneyRequest, $request->user(), $note ? (string) $note : null);
        activity()->causedBy($request->user())->performedOn($addMoneyRequest)->log('add money rejected');

        return back()->with('success', 'Add money rejected.');
    }
}

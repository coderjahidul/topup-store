<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCouponRequest;
use App\Models\Coupon;
use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(): Response
    {
        $coupons = Coupon::query()
            ->with('game')
            ->latest('id')
            ->paginate(20)
            ->through(fn (Coupon $coupon) => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $coupon->type->value,
                'value' => $coupon->value,
                'usage_limit' => $coupon->usage_limit,
                'used_count' => $coupon->used_count,
                'is_active' => $coupon->is_active,
                'starts_at' => $coupon->starts_at?->toDateTimeString(),
                'expires_at' => $coupon->expires_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Coupons/Form', [
            'coupon' => null,
            'games' => $this->games(),
            'mode' => 'create',
        ]);
    }

    public function store(StoreCouponRequest $request): RedirectResponse
    {
        $data = $this->prepare($request->validated());
        $coupon = Coupon::query()->create($data);
        activity()->causedBy($request->user())->performedOn($coupon)->log('coupon created');

        return redirect()->route('admin.coupons.index')->with('success', 'Coupon created.');
    }

    public function edit(Coupon $coupon): Response
    {
        return Inertia::render('Admin/Coupons/Form', [
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $coupon->type->value,
                'value' => $coupon->value,
                'min_order_amount' => $coupon->min_order_amount,
                'max_discount' => $coupon->max_discount,
                'usage_limit' => $coupon->usage_limit,
                'per_user_limit' => $coupon->per_user_limit,
                'starts_at' => $coupon->starts_at?->format('Y-m-d\TH:i'),
                'expires_at' => $coupon->expires_at?->format('Y-m-d\TH:i'),
                'applicable_game_id' => $coupon->applicable_game_id,
                'first_order_only' => $coupon->first_order_only,
                'is_active' => $coupon->is_active,
            ],
            'games' => $this->games(),
            'mode' => 'edit',
        ]);
    }

    public function update(StoreCouponRequest $request, Coupon $coupon): RedirectResponse
    {
        $coupon->update($this->prepare($request->validated()));
        activity()->causedBy($request->user())->performedOn($coupon)->log('coupon updated');

        return redirect()->route('admin.coupons.index')->with('success', 'Coupon updated.');
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        $coupon->delete();

        return redirect()->route('admin.coupons.index')->with('success', 'Coupon deleted.');
    }

    /**
     * @return list<array{id:int,name:string}>
     */
    private function games(): array
    {
        $locale = app()->getLocale();

        return Game::query()->orderBy('sort_order')->get()->map(fn (Game $game) => [
            'id' => $game->id,
            'name' => $game->getTranslation('name', $locale),
        ])->all();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function prepare(array $data): array
    {
        $data['code'] = strtoupper(trim((string) $data['code']));
        $data['first_order_only'] = (bool) ($data['first_order_only'] ?? false);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        foreach (['max_discount', 'usage_limit', 'applicable_game_id', 'starts_at', 'expires_at'] as $nullable) {
            if (array_key_exists($nullable, $data) && $data[$nullable] === '') {
                $data[$nullable] = null;
            }
        }

        return $data;
    }
}

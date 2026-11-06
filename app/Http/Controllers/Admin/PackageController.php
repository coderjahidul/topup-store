<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsTranslatable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePackageRequest;
use App\Http\Requests\Admin\UpdatePackageRequest;
use App\Models\Game;
use App\Models\Package;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    use TransformsTranslatable;

    public function index(Request $request): Response
    {
        $locale = app()->getLocale();
        $gameId = $request->integer('game_id') ?: null;

        $packages = Package::query()
            ->with('game')
            ->when($gameId, fn ($q) => $q->where('game_id', $gameId))
            ->orderBy('sort_order')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Package $package) => [
                'id' => $package->id,
                'name' => $package->getTranslation('name', $locale),
                'game' => $package->game?->getTranslation('name', $locale),
                'game_id' => $package->game_id,
                'price' => $package->price,
                'discount_price' => $package->discount_price,
                'stock' => $package->stock,
                'is_active' => $package->is_active,
                'sort_order' => $package->sort_order,
            ]);

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages,
            'games' => $this->gameOptions($locale),
            'filters' => ['game_id' => $gameId],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Packages/Form', [
            'package' => null,
            'games' => $this->gameOptions(app()->getLocale()),
            'mode' => 'create',
        ]);
    }

    public function store(StorePackageRequest $request): RedirectResponse
    {
        $data = $this->preparePackageData($request->validated());
        $package = Package::query()->create($data);
        activity()->causedBy($request->user())->performedOn($package)->log('package created');

        return redirect()->route('admin.packages.index')->with('success', 'Package created.');
    }

    public function edit(Package $package): Response
    {
        return Inertia::render('Admin/Packages/Form', [
            'package' => [
                'id' => $package->id,
                'game_id' => $package->game_id,
                'price' => $package->price,
                'discount_price' => $package->discount_price,
                'reseller_price' => $package->reseller_price,
                'cost_price' => $package->cost_price,
                'stock' => $package->stock,
                'supplier_code' => $package->supplier_code,
                'sort_order' => $package->sort_order,
                'is_active' => $package->is_active,
                ...$this->flattenTranslations($package, ['name']),
            ],
            'games' => $this->gameOptions(app()->getLocale()),
            'mode' => 'edit',
        ]);
    }

    public function update(UpdatePackageRequest $request, Package $package): RedirectResponse
    {
        $package->update($this->preparePackageData($request->validated()));
        activity()->causedBy($request->user())->performedOn($package)->log('package updated');

        return redirect()->route('admin.packages.index')->with('success', 'Package updated.');
    }

    public function destroy(Package $package): RedirectResponse
    {
        $package->delete();
        activity()->causedBy(auth()->user())->performedOn($package)->log('package deleted');

        return redirect()->route('admin.packages.index')->with('success', 'Package deleted.');
    }

    /**
     * @return list<array{id:int,name:string}>
     */
    private function gameOptions(string $locale): array
    {
        return Game::query()->orderBy('sort_order')->get()->map(fn (Game $game) => [
            'id' => $game->id,
            'name' => $game->getTranslation('name', $locale),
        ])->all();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function preparePackageData(array $data): array
    {
        $data = $this->mapTranslations($data, ['name']);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        foreach (['discount_price', 'reseller_price', 'cost_price', 'stock'] as $nullable) {
            if (array_key_exists($nullable, $data) && $data[$nullable] === '') {
                $data[$nullable] = null;
            }
        }

        return $data;
    }
}

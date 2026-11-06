<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsTranslatable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGameRequest;
use App\Http\Requests\Admin\UpdateGameRequest;
use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    use TransformsTranslatable;

    public function index(): Response
    {
        $locale = app()->getLocale();

        $games = Game::query()
            ->withCount('packages')
            ->orderBy('sort_order')
            ->paginate(20)
            ->through(fn (Game $game) => [
                'id' => $game->id,
                'name' => $game->getTranslation('name', $locale),
                'slug' => $game->slug,
                'sort_order' => $game->sort_order,
                'is_active' => $game->is_active,
                'packages_count' => $game->packages_count,
            ]);

        return Inertia::render('Admin/Games/Index', [
            'games' => $games,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Games/Form', [
            'game' => null,
            'mode' => 'create',
        ]);
    }

    public function store(StoreGameRequest $request): RedirectResponse
    {
        $data = $this->prepareGameData($request->validated());
        $game = Game::query()->create($data);
        activity()->causedBy($request->user())->performedOn($game)->log('game created');

        return redirect()->route('admin.games.index')->with('success', 'Game created.');
    }

    public function edit(Game $game): Response
    {
        return Inertia::render('Admin/Games/Form', [
            'game' => [
                'id' => $game->id,
                'slug' => $game->slug,
                'requires_server' => $game->requires_server,
                'servers' => $game->servers ?? [],
                'sort_order' => $game->sort_order,
                'is_active' => $game->is_active,
                ...$this->flattenTranslations($game, ['name', 'description', 'uid_label']),
            ],
            'mode' => 'edit',
        ]);
    }

    public function update(UpdateGameRequest $request, Game $game): RedirectResponse
    {
        $validated = $request->validated();

        if (count($validated) === 1 && array_key_exists('is_active', $validated)) {
            $game->update(['is_active' => (bool) $validated['is_active']]);
        } else {
            $game->update($this->prepareGameData($validated));
        }

        activity()->causedBy($request->user())->performedOn($game)->log('game updated');

        return redirect()->route('admin.games.index')->with('success', 'Game updated.');
    }

    public function destroy(Game $game): RedirectResponse
    {
        $game->delete();
        activity()->causedBy(auth()->user())->performedOn($game)->log('game deleted');

        return redirect()->route('admin.games.index')->with('success', 'Game deleted.');
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function prepareGameData(array $data): array
    {
        $data = $this->mapTranslations($data, ['name', 'description', 'uid_label']);

        if (empty($data['slug']) && ! empty($data['name']['en'])) {
            $data['slug'] = Str::slug($data['name']['en']);
        }

        if (array_key_exists('servers', $data)) {
            if (is_string($data['servers'])) {
                $data['servers'] = collect(explode(',', $data['servers']))
                    ->map(fn ($s) => trim($s))
                    ->filter()
                    ->values()
                    ->all();
            }
        }

        $data['is_active'] = (bool) ($data['is_active'] ?? true);
        $data['requires_server'] = (bool) ($data['requires_server'] ?? false);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        return $data;
    }
}

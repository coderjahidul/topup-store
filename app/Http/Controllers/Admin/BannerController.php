<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsTranslatable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBannerRequest;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    use TransformsTranslatable;

    public function index(): Response
    {
        $locale = app()->getLocale();

        $banners = Banner::query()
            ->orderBy('sort_order')
            ->paginate(20)
            ->through(fn (Banner $banner) => [
                'id' => $banner->id,
                'title' => $banner->getTranslation('title', $locale),
                'image' => $banner->image,
                'link' => $banner->link,
                'sort_order' => $banner->sort_order,
                'is_active' => $banner->is_active,
            ]);

        return Inertia::render('Admin/Banners/Index', ['banners' => $banners]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Banners/Form', ['banner' => null, 'mode' => 'create']);
    }

    public function store(StoreBannerRequest $request): RedirectResponse
    {
        $data = $this->prepare($request->validated());
        Banner::query()->create($data);

        return redirect()->route('admin.banners.index')->with('success', 'Banner created.');
    }

    public function edit(Banner $banner): Response
    {
        return Inertia::render('Admin/Banners/Form', [
            'banner' => [
                'id' => $banner->id,
                'image' => $banner->image,
                'link' => $banner->link,
                'sort_order' => $banner->sort_order,
                'is_active' => $banner->is_active,
                ...$this->flattenTranslations($banner, ['title']),
            ],
            'mode' => 'edit',
        ]);
    }

    public function update(StoreBannerRequest $request, Banner $banner): RedirectResponse
    {
        $banner->update($this->prepare($request->validated()));

        return redirect()->route('admin.banners.index')->with('success', 'Banner updated.');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        $banner->delete();

        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted.');
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function prepare(array $data): array
    {
        $data = $this->mapTranslations($data, ['title']);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        return $data;
    }
}

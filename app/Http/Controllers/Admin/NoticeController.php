<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsTranslatable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreNoticeRequest;
use App\Models\Notice;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NoticeController extends Controller
{
    use TransformsTranslatable;

    public function index(): Response
    {
        $locale = app()->getLocale();

        $notices = Notice::query()
            ->latest('id')
            ->paginate(20)
            ->through(fn (Notice $notice) => [
                'id' => $notice->id,
                'message' => $notice->getTranslation('message', $locale),
                'is_active' => $notice->is_active,
            ]);

        return Inertia::render('Admin/Notices/Index', ['notices' => $notices]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Notices/Form', ['notice' => null, 'mode' => 'create']);
    }

    public function store(StoreNoticeRequest $request): RedirectResponse
    {
        Notice::query()->create($this->prepare($request->validated()));

        return redirect()->route('admin.notices.index')->with('success', 'Notice created.');
    }

    public function edit(Notice $notice): Response
    {
        return Inertia::render('Admin/Notices/Form', [
            'notice' => [
                'id' => $notice->id,
                'is_active' => $notice->is_active,
                ...$this->flattenTranslations($notice, ['message']),
            ],
            'mode' => 'edit',
        ]);
    }

    public function update(StoreNoticeRequest $request, Notice $notice): RedirectResponse
    {
        $notice->update($this->prepare($request->validated()));

        return redirect()->route('admin.notices.index')->with('success', 'Notice updated.');
    }

    public function destroy(Notice $notice): RedirectResponse
    {
        $notice->delete();

        return redirect()->route('admin.notices.index')->with('success', 'Notice deleted.');
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function prepare(array $data): array
    {
        $data = $this->mapTranslations($data, ['message']);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        return $data;
    }
}

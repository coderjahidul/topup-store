<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $activities = Activity::query()
            ->with('causer')
            ->latest('id')
            ->paginate(30)
            ->through(fn (Activity $activity) => [
                'id' => $activity->id,
                'description' => $activity->description,
                'causer_name' => $activity->causer?->name ?? 'System',
                'subject_type' => class_basename((string) $activity->subject_type),
                'created_at' => $activity->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/ActivityLog/Index', [
            'activities' => $activities,
        ]);
    }
}

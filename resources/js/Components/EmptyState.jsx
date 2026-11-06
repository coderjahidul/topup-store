import { Link } from '@inertiajs/react';

export default function EmptyState({ title, description, actionHref, actionLabel }) {
    return (
        <div className="rounded-2xl border border-dashed border-white/15 bg-navy-900/40 px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-400/20">
                <svg className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                </svg>
            </div>
            <p className="text-base font-semibold text-white">{title}</p>
            {description && <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{description}</p>}
            {actionHref && actionLabel && (
                <Link
                    href={actionHref}
                    className="mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 text-sm font-semibold text-navy-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}

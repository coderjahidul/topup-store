import { Link } from '@inertiajs/react';

export default function AccountPageHeader({
    eyebrow,
    title,
    description,
    actions = null,
    breadcrumbs = [],
}) {
    return (
        <div className="relative overflow-hidden border-b border-white/5 bg-navy-900/50">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.08),transparent_40%)]" />
            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {breadcrumbs.length > 0 && (
                    <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        {breadcrumbs.map((crumb, index) => (
                            <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1.5">
                                {index > 0 && <span className="text-slate-600">/</span>}
                                {crumb.href ? (
                                    <Link href={crumb.href} className="hover:text-cyan-300">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-slate-400">{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        {eyebrow && (
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/90">
                                {eyebrow}
                            </p>
                        )}
                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
                        {description && (
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
                        )}
                    </div>
                    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
                </div>
            </div>
        </div>
    );
}

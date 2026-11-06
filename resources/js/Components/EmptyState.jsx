export default function EmptyState({ title, description }) {
    return (
        <div className="rounded-2xl border border-dashed border-white/15 bg-navy-900/40 px-6 py-10 text-center">
            <p className="text-base font-semibold text-white">{title}</p>
            {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
        </div>
    );
}

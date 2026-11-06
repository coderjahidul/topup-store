const styles = {
    pending: 'bg-orange-500/15 text-orange-400 border-orange-400/30',
    processing: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
    completed: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
    failed: 'bg-red-500/15 text-red-300 border-red-400/30',
    refunded: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
    cancelled: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export default function StatusBadge({ status, label }) {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                styles[status] ?? styles.pending
            }`}
        >
            {label ?? status}
        </span>
    );
}

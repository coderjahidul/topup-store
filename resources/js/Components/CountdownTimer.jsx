import { useEffect, useState } from 'react';

function getRemaining(target) {
    const end = new Date(target).getTime();
    const diff = Math.max(0, end - Date.now());

    const hours = Math.floor(diff / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);

    return { hours, minutes, seconds, done: diff <= 0 };
}

function pad(value) {
    return String(value).padStart(2, '0');
}

export default function CountdownTimer({ endsAt, label }) {
    const [remaining, setRemaining] = useState(() => getRemaining(endsAt));

    useEffect(() => {
        const id = setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
        return () => clearInterval(id);
    }, [endsAt]);

    return (
        <div className="inline-flex items-center gap-3 rounded-xl border border-orange-400/30 bg-orange-500/10 px-3 py-2">
            {label && <span className="text-xs font-medium text-orange-300">{label}</span>}
            <div className="flex gap-1 font-mono text-sm font-semibold text-white">
                <span>{pad(remaining.hours)}</span>
                <span className="text-orange-300">:</span>
                <span>{pad(remaining.minutes)}</span>
                <span className="text-orange-300">:</span>
                <span>{pad(remaining.seconds)}</span>
            </div>
        </div>
    );
}

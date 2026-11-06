export default function NoticeMarquee({ notices = [] }) {
    if (!notices.length) {
        return null;
    }

    const text = notices.map((notice) => notice.message).join('   •   ');

    return (
        <div className="overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-500/10 py-2">
            <div className="animate-[marquee_28s_linear_infinite] whitespace-nowrap px-4 text-sm font-medium text-cyan-100">
                {text}
                <span className="mx-8 text-cyan-500/50">•</span>
                {text}
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}

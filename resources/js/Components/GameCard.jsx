import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function GameCard({ game }) {
    const { t } = useTrans();

    return (
        <Link
            href={route('games.show', game.slug)}
            className="group block overflow-hidden rounded-2xl border border-white/10 bg-navy-900/70 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-glow-cyan"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-cyan-500/20 via-navy-800 to-violet-500/20">
                {game.image ? (
                    <img
                        src={game.image}
                        alt={game.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-bold text-white/30">
                        {game.name?.slice(0, 1)}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-base font-semibold text-white group-hover:text-cyan-300">
                    {game.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                    {game.packages_count} {t('home.packages')}
                </p>
            </div>
        </Link>
    );
}

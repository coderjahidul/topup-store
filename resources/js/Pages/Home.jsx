import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function Home() {
    const { t } = useTrans();

    return (
        <AppLayout title={t('nav.home')}>
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_35%)]" />
                <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-24">
                    <div className="animate-fade-up max-w-2xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                            {t('app.name')}
                        </p>
                        <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                            {t('home.hero_title')}
                        </h1>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                            {t('home.hero_subtitle')}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#games"
                                className="animate-glow-pulse inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                            >
                                {t('home.cta_shop')}
                            </a>
                            <a
                                href="#track"
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                            >
                                {t('home.cta_track')}
                            </a>
                        </div>
                    </div>

                    <div className="animate-fade-up relative mx-auto w-full max-w-md lg:mx-0" style={{ animationDelay: '120ms' }}>
                        <div className="rounded-3xl border border-white/10 bg-navy-900/70 p-6 shadow-glow-violet backdrop-blur">
                            <div className="grid grid-cols-2 gap-3">
                                {['Free Fire', 'PUBG UC', 'MLBB', 'Honor'].map((game) => (
                                    <div
                                        key={game}
                                        className="rounded-2xl border border-white/10 bg-navy-800/80 p-4 transition hover:border-cyan-400/40 hover:shadow-glow-cyan"
                                    >
                                        <div className="mb-3 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20" />
                                        <p className="text-sm font-semibold text-white">{game}</p>
                                        <p className="mt-1 text-xs text-slate-400">Coming soon</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="games" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-white">{t('nav.games')}</h2>
                <p className="mt-2 text-slate-400">
                    Phase 3 will add the full game grid, banners, and packages.
                </p>
            </section>

            <section id="track" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-white">{t('nav.track_order')}</h2>
                <p className="mt-2 text-slate-400">
                    Phase 4 will add public order tracking by order number + phone.
                </p>
                <Link
                    href={route('login')}
                    className="mt-4 inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-200"
                >
                    {t('nav.login')} →
                </Link>
            </section>
        </AppLayout>
    );
}

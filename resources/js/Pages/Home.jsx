import BannerSlider from '@/Components/BannerSlider';
import CountdownTimer from '@/Components/CountdownTimer';
import EmptyState from '@/Components/EmptyState';
import GameCard from '@/Components/GameCard';
import NoticeMarquee from '@/Components/NoticeMarquee';
import PackageCard from '@/Components/PackageCard';
import StatusBadge from '@/Components/StatusBadge';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function Home({
    banners = [],
    notices = [],
    games = [],
    popularPackages = [],
    flashSaleEndsAt,
    recentOrders = [],
    reviews = [],
}) {
    const { t } = useTrans();

    return (
        <AppLayout title={t('nav.home')}>
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.16),transparent_30%)]" />
                <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <div className="animate-fade-up mb-8 max-w-3xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                            {t('app.name')}
                        </p>
                        <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl">
                            {t('home.hero_title')}
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                            {t('home.hero_subtitle')}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="#games"
                                className="animate-glow-pulse inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white"
                            >
                                {t('home.cta_shop')}
                            </a>
                            <Link
                                href={route('orders.track')}
                                className="inline-flex rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100"
                            >
                                {t('home.cta_track')}
                            </Link>
                        </div>
                    </div>

                    <BannerSlider banners={banners} />
                    <div className="mt-4">
                        <NoticeMarquee notices={notices} />
                    </div>
                </div>
            </section>

            <section id="games" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">{t('home.games')}</h2>
                </div>
                {games.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {games.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                ) : (
                    <EmptyState title={t('common.empty')} />
                )}
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{t('home.flash_sale')}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('home.popular_packages')}</p>
                    </div>
                    {flashSaleEndsAt && (
                        <CountdownTimer endsAt={flashSaleEndsAt} label={t('home.flash_ends')} />
                    )}
                </div>
                {popularPackages.length ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {popularPackages.map((packageItem) => (
                            <PackageCard
                                key={packageItem.id}
                                packageItem={packageItem}
                                showGame
                                onSelect={() => {
                                    if (packageItem.game?.slug) {
                                        router.visit(route('games.show', packageItem.game.slug));
                                    }
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState title={t('common.empty')} />
                )}
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-bold text-white">{t('home.recent_orders')}</h2>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                    {recentOrders.length ? (
                        <ul className="divide-y divide-white/5">
                            {recentOrders.map((order) => (
                                <li
                                    key={order.id}
                                    className="flex flex-wrap items-center justify-between gap-3 bg-navy-900/50 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {order.name}
                                            <span className="mx-2 text-slate-600">·</span>
                                            <span className="text-slate-300">{order.game}</span>
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {order.package} · {order.created_at}
                                        </p>
                                    </div>
                                    <StatusBadge
                                        status={order.status}
                                        label={t(`status.${order.status}`) !== `status.${order.status}`
                                            ? t(`status.${order.status}`)
                                            : order.status}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4">
                            <EmptyState title={t('common.empty')} />
                        </div>
                    )}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-bold text-white">{t('home.why_us')}</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { title: t('home.why_fast'), desc: t('home.why_fast_desc') },
                        { title: t('home.why_safe'), desc: t('home.why_safe_desc') },
                        { title: t('home.why_support'), desc: t('home.why_support_desc') },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 transition hover:border-cyan-400/30"
                        >
                            <h3 className="text-lg font-semibold text-cyan-300">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-bold text-white">{t('home.reviews')}</h2>
                {reviews.length ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        {reviews.map((review) => (
                            <article
                                key={review.id}
                                className="rounded-2xl border border-white/10 bg-navy-900/60 p-5"
                            >
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <p className="font-medium text-white">{review.name}</p>
                                    <p className="text-sm text-orange-300">{'★'.repeat(review.rating)}</p>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-400">{review.comment}</p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <EmptyState title={t('common.empty')} />
                )}
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-bold text-white">{t('home.faq')}</h2>
                <div className="space-y-3">
                    {[
                        [t('home.faq_q1'), t('home.faq_a1')],
                        [t('home.faq_q2'), t('home.faq_a2')],
                        [t('home.faq_q3'), t('home.faq_a3')],
                    ].map(([question, answer]) => (
                        <details
                            key={question}
                            className="group rounded-2xl border border-white/10 bg-navy-900/50 px-5 py-4"
                        >
                            <summary className="cursor-pointer list-none font-semibold text-white marker:content-none">
                                {question}
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-slate-400">{answer}</p>
                        </details>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}

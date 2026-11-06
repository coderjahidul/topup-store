import AccountPageHeader from '@/Components/AccountPageHeader';
import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

function money(value, t) {
    return `${t('common.bdt')}${Number(value || 0).toLocaleString('en-BD')}`;
}

export default function Dashboard({ stats, recentOrders = [], recentTransactions = [] }) {
    const { t } = useTrans();
    const user = usePage().props.auth.user;
    const firstName = (user?.name || '').split(/\s+/)[0] || user?.name;

    return (
        <AuthenticatedLayout
            header={
                <AccountPageHeader
                    eyebrow={t('nav.account') || 'My Account'}
                    title={`${t('dashboard.welcome') || 'Welcome'}, ${firstName}`}
                    description={t('account.dashboard_hint') || 'Track your wallet, orders, and referrals in one place.'}
                    actions={
                        <>
                            <Link
                                href={route('home')}
                                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
                            >
                                {t('account.browse_games') || 'Browse games'}
                            </Link>
                            <Link
                                href={route('wallet.add-money')}
                                className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 text-sm font-bold text-navy-950 shadow-lg shadow-cyan-500/20"
                            >
                                {t('nav.add_money') || 'Add Money'}
                            </Link>
                        </>
                    }
                />
            }
        >
            <Head title={t('nav.dashboard')} />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-4 lg:grid-cols-12">
                    <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-navy-900 via-navy-900 to-cyan-950/40 p-6 lg:col-span-5">
                        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400/90">
                            {t('game.wallet_balance')}
                        </p>
                        <p className="mt-3 text-4xl font-bold tracking-tight text-white">{money(stats.balance, t)}</p>
                        <p className="mt-2 text-sm text-slate-400">
                            {t('account.wallet_ready') || 'Ready to top up your favorite games.'}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Link
                                href={route('wallet.add-money')}
                                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-navy-950"
                            >
                                {t('nav.add_money') || 'Add Money'}
                            </Link>
                            <Link
                                href={route('customer.transactions')}
                                className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-200"
                            >
                                {t('nav.transactions') || 'Transactions'}
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
                        {[
                            {
                                label: t('nav.orders'),
                                value: stats.orders_count,
                                hint: t('account.total_orders') || 'Total orders',
                            },
                            {
                                label: t('status.completed'),
                                value: stats.completed_orders,
                                hint: t('account.delivered') || 'Delivered successfully',
                            },
                            {
                                label: t('nav.referral') || 'Referral',
                                value: stats.referral_code,
                                hint: `${stats.referral_count || 0} ${t('account.friends') || 'friends'} · ${money(stats.referral_earnings, t)}`,
                                mono: true,
                            },
                        ].map((card) => (
                            <div
                                key={card.label}
                                className="rounded-2xl border border-white/10 bg-navy-900/70 p-5 transition hover:border-cyan-400/20"
                            >
                                <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
                                <p
                                    className={`mt-3 font-bold text-cyan-300 ${
                                        card.mono ? 'font-mono text-lg tracking-wider' : 'text-3xl'
                                    }`}
                                >
                                    {card.value}
                                </p>
                                <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-white/10 bg-navy-900/50 p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-white">{t('account.recent_orders') || 'Recent orders'}</h2>
                                <p className="text-xs text-slate-500">{t('account.recent_orders_hint') || 'Your latest top-ups'}</p>
                            </div>
                            <Link href={route('customer.orders.index')} className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
                                {t('common.view_all') || 'View all'}
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <EmptyState
                                title={t('account.no_orders') || 'No orders yet'}
                                description={t('account.no_orders_hint') || 'Buy diamonds or UC to see your order history here.'}
                                actionHref={route('home')}
                                actionLabel={t('account.browse_games') || 'Browse games'}
                            />
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('customer.orders.show', order.id)}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-navy-950/60 px-4 py-3 transition hover:border-cyan-400/25 hover:bg-navy-950"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium text-white">{order.order_number}</p>
                                            <p className="truncate text-xs text-slate-400">
                                                {order.game} · {order.package}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-slate-200">
                                                {money(order.final_amount, t)}
                                            </span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-navy-900/50 p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    {t('account.recent_activity') || 'Wallet activity'}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {t('account.recent_activity_hint') || 'Credits, debits, and refunds'}
                                </p>
                            </div>
                            <Link href={route('customer.transactions')} className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
                                {t('common.view_all') || 'View all'}
                            </Link>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <EmptyState
                                title={t('account.no_transactions') || 'No transactions yet'}
                                description={t('account.no_transactions_hint') || 'Add money or place an order to start your ledger.'}
                                actionHref={route('wallet.add-money')}
                                actionLabel={t('nav.add_money') || 'Add Money'}
                            />
                        ) : (
                            <div className="space-y-3">
                                {recentTransactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-navy-950/60 px-4 py-3"
                                    >
                                        <div>
                                            <p className="capitalize text-sm font-medium text-white">
                                                {(tx.source || '').replaceAll('_', ' ')}
                                            </p>
                                            <p className="text-xs text-slate-500">{tx.created_at}</p>
                                        </div>
                                        <p
                                            className={`text-sm font-bold ${
                                                tx.type === 'credit' ? 'text-emerald-300' : 'text-orange-300'
                                            }`}
                                        >
                                            {tx.type === 'credit' ? '+' : '−'}
                                            {money(tx.amount, t)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    {[
                        {
                            href: route('customer.referrals'),
                            title: t('nav.referral') || 'Referral',
                            text: t('account.referral_cta') || 'Share your code and grow earnings.',
                        },
                        {
                            href: route('profile.edit'),
                            title: t('nav.profile'),
                            text: t('account.profile_cta') || 'Update phone, language, and security.',
                        },
                        {
                            href: route('orders.track'),
                            title: t('nav.track_order') || 'Track order',
                            text: t('account.track_cta') || 'Look up any order with number + phone.',
                        },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-2xl border border-white/10 bg-navy-900/40 p-5 transition hover:border-cyan-400/30 hover:bg-navy-900/70"
                        >
                            <p className="font-semibold text-white">{item.title}</p>
                            <p className="mt-1 text-sm text-slate-400">{item.text}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

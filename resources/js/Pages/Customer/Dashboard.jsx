import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

function money(value, t) {
    return `${t('common.bdt')}${Number(value || 0).toLocaleString('en-BD')}`;
}

export default function Dashboard({ stats, recentOrders = [], recentTransactions = [] }) {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-white">{t('nav.dashboard')}</h2>}
        >
            <Head title={t('nav.dashboard')} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: t('game.wallet_balance'), value: money(stats.balance, t) },
                            { label: t('nav.orders'), value: stats.orders_count },
                            { label: t('status.completed'), value: stats.completed_orders },
                            { label: t('nav.referral') || 'Referral', value: stats.referral_code },
                        ].map((card) => (
                            <div
                                key={card.label}
                                className="rounded-2xl border border-white/10 bg-navy-900/70 p-4"
                            >
                                <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
                                <p className="mt-2 text-xl font-bold text-cyan-300">{card.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('wallet.add-money')}
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
                        >
                            {t('nav.add_money') || 'Add Money'}
                        </Link>
                        <Link
                            href={route('customer.orders.index')}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200"
                        >
                            {t('nav.orders')}
                        </Link>
                        <Link
                            href={route('customer.transactions')}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200"
                        >
                            {t('nav.transactions') || 'Transactions'}
                        </Link>
                        <Link
                            href={route('customer.referrals')}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200"
                        >
                            {t('nav.referral') || 'Referral'}
                        </Link>
                    </div>

                    <section className="rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">{t('nav.orders')}</h3>
                            <Link href={route('customer.orders.index')} className="text-sm text-cyan-300">
                                {t('common.continue')} →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentOrders.length === 0 && (
                                <p className="text-sm text-slate-500">{t('common.empty')}</p>
                            )}
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-navy-950/50 px-4 py-3"
                                >
                                    <div>
                                        <p className="font-medium text-white">{order.order_number}</p>
                                        <p className="text-xs text-slate-400">
                                            {order.game} · {order.package}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={order.status} />
                                        <Link
                                            href={route('customer.orders.show', order.id)}
                                            className="text-sm text-cyan-300"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                {t('nav.transactions') || 'Transactions'}
                            </h3>
                            <Link href={route('customer.transactions')} className="text-sm text-cyan-300">
                                {t('common.continue')} →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentTransactions.length === 0 && (
                                <p className="text-sm text-slate-500">{t('common.empty')}</p>
                            )}
                            {recentTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between rounded-xl border border-white/5 bg-navy-950/50 px-4 py-3 text-sm"
                                >
                                    <div>
                                        <p className="capitalize text-white">{tx.source.replace('_', ' ')}</p>
                                        <p className="text-xs text-slate-500">{tx.created_at}</p>
                                    </div>
                                    <p
                                        className={
                                            tx.type === 'credit' ? 'font-semibold text-cyan-300' : 'font-semibold text-orange-300'
                                        }
                                    >
                                        {tx.type === 'credit' ? '+' : '-'}
                                        {money(tx.amount, t)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

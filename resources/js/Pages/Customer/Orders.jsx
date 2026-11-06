import AccountPageHeader from '@/Components/AccountPageHeader';
import EmptyState from '@/Components/EmptyState';
import PaginationBar from '@/Components/PaginationBar';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

function money(value, t) {
    return `${t('common.bdt')}${Number(value || 0).toLocaleString('en-BD')}`;
}

export default function Orders({ orders }) {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout
            header={
                <AccountPageHeader
                    eyebrow={t('nav.account') || 'My Account'}
                    title={t('nav.orders')}
                    description={t('account.orders_hint') || 'Re-order instantly or leave a review after delivery.'}
                    breadcrumbs={[
                        { label: t('nav.dashboard'), href: route('dashboard') },
                        { label: t('nav.orders') },
                    ]}
                    actions={
                        <Link
                            href={route('home')}
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 text-sm font-bold text-navy-950"
                        >
                            {t('account.new_order') || 'New order'}
                        </Link>
                    }
                />
            }
        >
            <Head title={t('nav.orders')} />

            <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
                {(orders?.data?.length ?? 0) === 0 ? (
                    <EmptyState
                        title={t('account.no_orders') || 'No orders yet'}
                        description={t('account.no_orders_hint') || 'Buy diamonds or UC to see your order history here.'}
                        actionHref={route('home')}
                        actionLabel={t('account.browse_games') || 'Browse games'}
                    />
                ) : (
                    <div className="space-y-3">
                        {orders.data.map((order) => (
                            <article
                                key={order.id}
                                className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 transition hover:border-cyan-400/20"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-lg font-semibold text-white">{order.order_number}</h2>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <p className="mt-1 text-sm text-slate-300">
                                            {order.game}
                                            <span className="text-slate-600"> · </span>
                                            {order.package}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-500">
                                            UID {order.player_uid}
                                            {order.server ? ` · ${order.server}` : ''}
                                            {' · '}
                                            {order.created_at}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-cyan-300">{money(order.final_amount, t)}</p>
                                        <p className="mt-1 text-xs capitalize text-slate-500">{order.payment_method}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                                    <Link
                                        href={route('customer.orders.show', order.id)}
                                        className="rounded-lg border border-white/15 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-white/5"
                                    >
                                        {t('common.details') || 'Details'}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => router.post(route('customer.orders.reorder', order.id))}
                                        className="rounded-lg bg-cyan-500/15 px-3 py-1.5 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-400/20 hover:bg-cyan-500/25"
                                    >
                                        {t('nav.reorder') || 'Re-order'}
                                    </button>
                                    {order.can_review && (
                                        <Link
                                            href={route('customer.orders.show', order.id)}
                                            className="rounded-lg bg-orange-500/15 px-3 py-1.5 text-sm font-semibold text-orange-200 ring-1 ring-orange-400/20"
                                        >
                                            {t('nav.write_review') || 'Write a review'}
                                        </Link>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <PaginationBar links={orders?.links} />
            </div>
        </AuthenticatedLayout>
    );
}

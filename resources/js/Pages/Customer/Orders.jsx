import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function Orders({ orders }) {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-white">{t('nav.orders')}</h2>}
        >
            <Head title={t('nav.orders')} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
                    {orders.data.length === 0 && (
                        <p className="rounded-2xl border border-white/10 bg-navy-900/50 p-6 text-slate-400">
                            {t('common.empty')}
                        </p>
                    )}

                    {orders.data.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-2xl border border-white/10 bg-navy-900/60 p-5"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-lg font-semibold text-white">{order.order_number}</p>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {order.game} · {order.package}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        UID: {order.player_uid} · {order.created_at}
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <Link
                                    href={route('customer.orders.show', order.id)}
                                    className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-200"
                                >
                                    Details
                                </Link>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(route('customer.orders.reorder', order.id))
                                    }
                                    className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-sm font-medium text-cyan-300"
                                >
                                    {t('nav.reorder') || 'Re-order'}
                                </button>
                                {order.can_review && (
                                    <Link
                                        href={route('customer.orders.show', order.id)}
                                        className="rounded-lg bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-violet-300"
                                    >
                                        {t('nav.review') || 'Review'}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}

                    {orders.links?.length > 3 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {orders.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    className={`rounded-lg px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-cyan-500 text-navy-950'
                                            : 'border border-white/10 text-slate-300'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

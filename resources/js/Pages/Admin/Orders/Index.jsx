import PaginationBar from '@/Components/PaginationBar';
import StatusBadge from '@/Components/StatusBadge';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

const orderStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'];

export default function OrdersIndex({ orders, filters, games }) {
    const { t } = useTrans();
    const { data, setData, get, processing, errors } = useForm({
        status: filters?.status ?? '',
        payment_method: filters?.payment_method ?? '',
        search: filters?.search ?? '',
        game_id: filters?.game_id ?? '',
        flagged: filters?.flagged ?? '',
    });

    const submitFilters = (event) => {
        event.preventDefault();
        get(route('admin.orders.index'), { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        router.get(route('admin.orders.index'));
    };

    return (
        <AdminLayout title={t('nav.orders') || 'Orders'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.orders') || 'Orders'}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.orders_hint') || 'Search and filter customer orders.'}</p>
                    </div>
                </div>

                <form
                    onSubmit={submitFilters}
                    className="grid gap-4 rounded-xl border border-white/10 bg-navy-900/40 p-4 sm:grid-cols-2 lg:grid-cols-5"
                >
                    <div className="lg:col-span-2">
                        <InputLabel htmlFor="search" value={t('common.search') || 'Search'} />
                        <TextInput
                            id="search"
                            className="mt-1 block w-full"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            placeholder={t('admin.order_search_ph') || 'Order #, UID, TRX…'}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="status" value={t('common.status') || 'Status'} />
                        <select
                            id="status"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="">{t('common.all') || 'All'}</option>
                            {orderStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <InputLabel htmlFor="payment_method" value={t('game.payment_method') || 'Payment method'} />
                        <TextInput
                            id="payment_method"
                            className="mt-1 block w-full"
                            value={data.payment_method}
                            onChange={(e) => setData('payment_method', e.target.value)}
                            placeholder="bkash, nagad…"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="game_id" value={t('nav.games') || 'Game'} />
                        <select
                            id="game_id"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                            value={data.game_id}
                            onChange={(e) => setData('game_id', e.target.value)}
                        >
                            <option value="">{t('common.all') || 'All'}</option>
                            {(games ?? []).map((game) => (
                                <option key={game.id} value={game.id}>
                                    {game.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <InputLabel htmlFor="flagged" value="Fraud" />
                        <select
                            id="flagged"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                            value={data.flagged}
                            onChange={(e) => setData('flagged', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="1">Flagged only</option>
                            <option value="0">Not flagged</option>
                        </select>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-5">
                        <PrimaryButton type="submit" disabled={processing}>
                            {t('common.apply') || 'Apply'}
                        </PrimaryButton>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200 hover:bg-white/5"
                        >
                            {t('common.reset') || 'Reset'}
                        </button>
                    </div>
                </form>

                {errors.search && <p className="text-sm text-red-400">{errors.search}</p>}

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[900px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">{t('admin.order_number') || 'Order #'}</th>
                                <th className="px-4 py-3 font-medium">{t('nav.games') || 'Game'}</th>
                                <th className="px-4 py-3 font-medium">{t('home.packages') || 'Package'}</th>
                                <th className="px-4 py-3 font-medium">{t('game.player_uid') || 'Player UID'}</th>
                                <th className="px-4 py-3 font-medium">{t('game.total') || 'Amount'}</th>
                                <th className="px-4 py-3 font-medium">{t('game.payment_method') || 'Payment'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Status'}</th>
                                <th className="px-4 py-3 font-medium text-end">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(orders?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No orders found.'}
                                    </td>
                                </tr>
                            )}
                            {(orders?.data ?? []).map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.02]">
                                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-cyan-200">
                                        {order.order_number}
                                    </td>
                                    <td className="px-4 py-3">{order.game_name ?? order.game ?? '—'}</td>
                                    <td className="px-4 py-3">{order.package_name ?? order.package ?? '—'}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{order.player_uid}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {t('common.bdt')}
                                        {Number(order.final_amount ?? order.amount ?? 0).toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3 capitalize">{order.payment_method ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <Link
                                            href={route('admin.orders.show', order.id)}
                                            className="rounded-lg border border-cyan-400/30 px-2.5 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-400/10"
                                        >
                                            {t('common.view') || 'View'}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={orders?.links} />
            </div>
        </AdminLayout>
    );
}

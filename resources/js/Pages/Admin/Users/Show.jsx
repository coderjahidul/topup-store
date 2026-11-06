import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import StatusBadge from '@/Components/StatusBadge';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function UsersShow({
    user,
    roles,
    recent_orders: recentOrdersSnake,
    recent_transactions: recentTransactionsSnake,
    recentOrders,
    recentTransactions,
}) {
    const ordersList = recentOrders ?? recentOrdersSnake ?? [];
    const txList = recentTransactions ?? recentTransactionsSnake ?? [];
    const { t } = useTrans();

    const balanceForm = useForm({
        amount: '',
        type: 'credit',
        note: '',
    });

    const roleForm = useForm({
        roles: (user.roles ?? []).map((r) => (typeof r === 'string' ? r : r.name)).filter(Boolean),
    });

    const submitBalance = (e) => {
        e.preventDefault();
        balanceForm.post(route('admin.users.adjust-balance', user.id), {
            preserveScroll: true,
            onSuccess: () => balanceForm.reset(),
        });
    };

    const submitRoles = (e) => {
        e.preventDefault();
        roleForm.post(route('admin.users.roles', user.id), { preserveScroll: true });
    };

    const roleOptions = (roles ?? []).map((r) => (typeof r === 'string' ? r : r.name)).filter(Boolean);

    const toggleRole = (roleName) => {
        const set = new Set(roleForm.data.roles);
        if (set.has(roleName)) {
            set.delete(roleName);
        } else {
            set.add(roleName);
        }
        roleForm.setData('roles', [...set]);
    };

    return (
        <AdminLayout title={user.name}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                        <p className="mt-1 text-sm text-slate-400">{user.phone ?? user.email}</p>
                    </div>
                    <Link href={route('admin.users.index')} className="text-sm text-cyan-300 hover:text-cyan-200">
                        ← {t('common.back') || 'Back'}
                    </Link>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-navy-900/50 p-5 lg:col-span-2">
                        <h3 className="text-sm font-semibold text-white">{t('common.details') || 'Details'}</h3>
                        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-slate-500">{t('admin.balance') || 'Balance'}</dt>
                                <dd className="font-semibold text-cyan-200">
                                    {t('common.bdt')}
                                    {Number(user.balance ?? 0).toLocaleString('en-BD')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">{t('common.status') || 'Status'}</dt>
                                <dd>
                                    {user.is_blocked || user.status === 'blocked' ? (
                                        <span className="text-red-300">{t('status.blocked') || 'Blocked'}</span>
                                    ) : (
                                        <span className="text-emerald-300">{t('status.active') || 'Active'}</span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">{t('admin.roles') || 'Roles'}</dt>
                                <dd className="text-slate-200">
                                    {(user.roles ?? []).length ? user.roles.map((r) => r.name ?? r).join(', ') : '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">ID</dt>
                                <dd className="font-mono text-xs">{user.id}</dd>
                            </div>
                        </dl>
                    </div>

                    <form onSubmit={submitBalance} className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-5">
                        <h3 className="text-sm font-semibold text-white">{t('admin.adjust_balance') || 'Adjust balance'}</h3>
                        <div>
                            <InputLabel htmlFor="amount" value={t('admin.amount') || 'Amount'} />
                            <TextInput
                                id="amount"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={balanceForm.data.amount}
                                onChange={(e) => balanceForm.setData('amount', e.target.value)}
                            />
                            <InputError message={balanceForm.errors.amount} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="type" value={t('admin.type') || 'Type'} />
                            <select
                                id="type"
                                className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                                value={balanceForm.data.type}
                                onChange={(e) => balanceForm.setData('type', e.target.value)}
                            >
                                <option value="credit">{t('admin.credit') || 'Credit'}</option>
                                <option value="debit">{t('admin.debit') || 'Debit'}</option>
                            </select>
                            <InputError message={balanceForm.errors.type} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="note" value={t('admin.note') || 'Note'} />
                            <TextInput
                                id="note"
                                className="mt-1 block w-full"
                                value={balanceForm.data.note}
                                onChange={(e) => balanceForm.setData('note', e.target.value)}
                            />
                            <InputError message={balanceForm.errors.note} className="mt-2" />
                        </div>
                        <PrimaryButton type="submit" className="w-full justify-center" disabled={balanceForm.processing}>
                            {t('admin.apply_adjustment') || 'Apply'}
                        </PrimaryButton>
                    </form>
                </div>

                <form onSubmit={submitRoles} className="rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <h3 className="text-sm font-semibold text-white">{t('admin.assign_roles') || 'Assign roles'}</h3>
                    <p className="mt-1 text-xs text-slate-500">{t('admin.assign_roles_hint') || 'Check roles to grant; uncheck to revoke.'}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {roleOptions.map((roleName) => (
                            <label
                                key={roleName}
                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400/30"
                            >
                                <input
                                    type="checkbox"
                                    className="rounded border-white/20 bg-navy-950 text-cyan-500 focus:ring-cyan-400"
                                    checked={roleForm.data.roles.includes(roleName)}
                                    onChange={() => toggleRole(roleName)}
                                />
                                {roleName}
                            </label>
                        ))}
                    </div>
                    <InputError message={roleForm.errors.roles} className="mt-2" />
                    <PrimaryButton type="submit" className="mt-4" disabled={roleForm.processing}>
                        {t('common.save') || 'Save roles'}
                    </PrimaryButton>
                </form>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-navy-900/30 p-4">
                        <h3 className="text-sm font-semibold text-white">{t('nav.orders') || 'Recent orders'}</h3>
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full text-left text-xs sm:text-sm">
                                <thead className="text-slate-500">
                                    <tr>
                                        <th className="pb-2 pe-2">{t('admin.order_number') || 'Order #'}</th>
                                        <th className="pb-2 pe-2">{t('common.status') || 'Status'}</th>
                                        <th className="pb-2">{t('game.total') || 'Amount'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {ordersList.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-4 text-center text-slate-500">
                                                {t('common.empty') || 'None'}
                                            </td>
                                        </tr>
                                    )}
                                    {ordersList.map((order) => (
                                        <tr key={order.id}>
                                            <td className="py-2 pe-2 font-mono text-cyan-200/90">{order.order_number}</td>
                                            <td className="py-2 pe-2">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-2">
                                                {t('common.bdt')}
                                                {Number(order.final_amount ?? order.amount ?? 0).toLocaleString('en-BD')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-navy-900/30 p-4">
                        <h3 className="text-sm font-semibold text-white">{t('nav.transactions') || 'Recent transactions'}</h3>
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full text-left text-xs sm:text-sm">
                                <thead className="text-slate-500">
                                    <tr>
                                        <th className="pb-2 pe-2">{t('admin.type') || 'Type'}</th>
                                        <th className="pb-2 pe-2">{t('game.total') || 'Amount'}</th>
                                        <th className="pb-2">Ref</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {txList.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-4 text-center text-slate-500">
                                                {t('common.empty') || 'None'}
                                            </td>
                                        </tr>
                                    )}
                                    {txList.map((tx) => (
                                        <tr key={tx.id}>
                                            <td className="py-2 pe-2 capitalize">{tx.type ?? tx.kind ?? '—'}</td>
                                            <td className="py-2 pe-2">
                                                {t('common.bdt')}
                                                {Number(tx.amount ?? 0).toLocaleString('en-BD')}
                                            </td>
                                            <td className="py-2 font-mono text-xs text-slate-400">{tx.reference ?? tx.id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

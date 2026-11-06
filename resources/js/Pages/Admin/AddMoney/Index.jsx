import PaginationBar from '@/Components/PaginationBar';
import StatusBadge from '@/Components/StatusBadge';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

function AddMoneyRequestRow({ row }) {
    const { t } = useTrans();
    const approveForm = useForm({ note: '' });
    const rejectForm = useForm({ note: '' });
    const isPending = row.status === 'pending';

    const submitApprove = (e) => {
        e.preventDefault();
        approveForm.post(route('admin.add-money.approve', row.id), {
            preserveScroll: true,
            onSuccess: () => approveForm.reset('note'),
        });
    };

    const submitReject = (e) => {
        e.preventDefault();
        rejectForm.post(route('admin.add-money.reject', row.id), {
            preserveScroll: true,
            onSuccess: () => rejectForm.reset('note'),
        });
    };

    return (
        <tr className="hover:bg-white/[0.02]">
            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">#{row.id}</td>
            <td className="px-4 py-3">
                <div className="font-medium text-white">{row.user?.name ?? row.user_name ?? '—'}</div>
                <div className="text-xs text-slate-500">{row.user?.phone ?? row.user_phone}</div>
            </td>
            <td className="px-4 py-3 capitalize">{row.payment_method ?? '—'}</td>
            <td className="whitespace-nowrap px-4 py-3">
                {t('common.bdt')}
                {Number(row.amount ?? 0).toLocaleString('en-BD')}
            </td>
            <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs">{row.trx_id ?? '—'}</td>
            <td className="px-4 py-3">
                <StatusBadge status={row.status} label={row.status} />
            </td>
            <td className="px-4 py-3 align-top">
                {isPending ? (
                    <div className="flex min-w-[220px] flex-col gap-3">
                        <form onSubmit={submitApprove} className="space-y-2 rounded-lg border border-cyan-400/20 bg-navy-950/40 p-2">
                            <InputLabel value={t('admin.approve_note') || 'Note (optional)'} />
                            <TextInput
                                className="block w-full text-xs"
                                value={approveForm.data.note}
                                onChange={(e) => approveForm.setData('note', e.target.value)}
                            />
                            <PrimaryButton type="submit" className="w-full justify-center py-1.5 text-[10px]" disabled={approveForm.processing}>
                                {t('admin.approve') || 'Approve'}
                            </PrimaryButton>
                        </form>
                        <form onSubmit={submitReject} className="space-y-2 rounded-lg border border-red-400/20 bg-navy-950/40 p-2">
                            <InputLabel value={t('admin.reject_note') || 'Note (optional)'} />
                            <TextInput
                                className="block w-full text-xs"
                                value={rejectForm.data.note}
                                onChange={(e) => rejectForm.setData('note', e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={rejectForm.processing}
                                className="inline-flex w-full items-center justify-center rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-300 hover:bg-red-500/20 disabled:opacity-25"
                            >
                                {t('admin.reject') || 'Reject'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <span className="text-xs text-slate-500">—</span>
                )}
            </td>
        </tr>
    );
}

export default function AddMoneyIndex({ requests, filters }) {
    const { t } = useTrans();

    const filterForm = useForm({
        status: filters?.status ?? '',
    });

    const applyFilters = (e) => {
        e.preventDefault();
        filterForm.get(route('admin.add-money.index'), { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title={t('nav.add_money') || 'Add money'}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">{t('nav.add_money') || 'Add money requests'}</h2>
                    <p className="mt-1 text-sm text-slate-400">{t('admin.add_money_hint') || 'Review wallet top-up submissions.'}</p>
                </div>

                <form
                    onSubmit={applyFilters}
                    className="flex flex-wrap items-end gap-4 rounded-xl border border-white/10 bg-navy-900/40 p-4"
                >
                    <div>
                        <InputLabel htmlFor="status" value={t('common.status') || 'Status'} />
                        <select
                            id="status"
                            className="mt-1 block min-w-[10rem] rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                            value={filterForm.data.status}
                            onChange={(e) => filterForm.setData('status', e.target.value)}
                        >
                            <option value="">{t('common.all') || 'All'}</option>
                            <option value="pending">{t('status.pending') || 'pending'}</option>
                            <option value="approved">{t('status.approved') || 'approved'}</option>
                            <option value="rejected">{t('status.rejected') || 'rejected'}</option>
                        </select>
                    </div>
                    <PrimaryButton type="submit" disabled={filterForm.processing}>
                        {t('common.apply') || 'Apply'}
                    </PrimaryButton>
                    <button
                        type="button"
                        onClick={() => router.get(route('admin.add-money.index'))}
                        className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200 hover:bg-white/5"
                    >
                        {t('common.reset') || 'Reset'}
                    </button>
                </form>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[960px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">ID</th>
                                <th className="px-4 py-3 font-medium">{t('admin.user') || 'User'}</th>
                                <th className="px-4 py-3 font-medium">{t('game.payment_method') || 'Method'}</th>
                                <th className="px-4 py-3 font-medium">{t('game.total') || 'Amount'}</th>
                                <th className="px-4 py-3 font-medium">{t('game.trx_id') || 'TRX'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Status'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(requests?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No requests.'}
                                    </td>
                                </tr>
                            )}
                            {(requests?.data ?? []).map((row) => (
                                <AddMoneyRequestRow key={row.id} row={row} />
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={requests?.links} />
            </div>
        </AdminLayout>
    );
}

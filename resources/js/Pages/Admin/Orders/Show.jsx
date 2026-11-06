import StatusBadge from '@/Components/StatusBadge';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function OrdersShow({ order }) {
    const { t } = useTrans();

    const failForm = useForm({ admin_note: '' });
    const cancelForm = useForm({ admin_note: '' });
    const noteForm = useForm({ admin_note: order?.admin_note ?? '' });

    const processForm = useForm({});
    const completeForm = useForm({});

    const submitFail = (e) => {
        e.preventDefault();
        failForm.post(route('admin.orders.fail', order.id), { preserveScroll: true });
    };

    const submitCancel = (e) => {
        e.preventDefault();
        cancelForm.post(route('admin.orders.cancel', order.id), { preserveScroll: true });
    };

    const submitNote = (e) => {
        e.preventDefault();
        noteForm.post(route('admin.orders.note', order.id), { preserveScroll: true });
    };

    const submitProcess = (e) => {
        e.preventDefault();
        processForm.post(route('admin.orders.processing', order.id), { preserveScroll: true });
    };

    const submitComplete = (e) => {
        e.preventDefault();
        completeForm.post(route('admin.orders.complete', order.id), { preserveScroll: true });
    };

    const rows = [
        [t('admin.order_number') || 'Order #', order.order_number],
        [t('nav.games') || 'Game', order.game_name ?? order.game],
        [t('home.packages') || 'Package', order.package_name ?? order.package],
        [t('game.player_uid') || 'Player UID', order.player_uid],
        [t('game.server') || 'Server', order.server || '—'],
        [
            t('game.total') || 'Amount',
            `${t('common.bdt')}${Number(order.final_amount ?? order.amount ?? 0).toLocaleString('en-BD')}`,
        ],
        [t('game.payment_method') || 'Payment method', order.payment_method],
        [t('game.trx_id') || 'TRX ID', order.trx_id || '—'],
        ['Created', order.created_at ?? '—'],
    ];

    return (
        <AdminLayout title={order.order_number}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-semibold text-white">{order.order_number}</h2>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.order_detail_hint') || 'Process or update this order.'}</p>
                    </div>
                    <Link
                        href={route('admin.orders.index')}
                        className="text-sm text-cyan-300 hover:text-cyan-200"
                    >
                        ← {t('common.back') || 'Back'}
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-navy-900/50 p-5 lg:col-span-2">
                        <h3 className="text-sm font-semibold text-white">{t('common.details') || 'Details'}</h3>
                        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                            {rows.map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-slate-500">{label}</dt>
                                    <dd className="mt-0.5 text-slate-200">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="space-y-4">
                        {order.can_process && (
                            <form onSubmit={submitProcess} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
                                <h3 className="text-sm font-semibold text-violet-300">{t('admin.mark_processing') || 'Mark processing'}</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {t('admin.mark_processing_hint') || 'Use when you start fulfilling the top-up.'}
                                </p>
                                <PrimaryButton type="submit" className="mt-3 w-full justify-center" disabled={processForm.processing}>
                                    {t('admin.processing') || 'Processing'}
                                </PrimaryButton>
                            </form>
                        )}

                        {order.can_complete && (
                            <form onSubmit={submitComplete} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
                                <h3 className="text-sm font-semibold text-cyan-300">{t('admin.complete') || 'Complete'}</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {t('admin.complete_hint') || 'Marks the order as successfully delivered.'}
                                </p>
                                <PrimaryButton type="submit" className="mt-3 w-full justify-center" disabled={completeForm.processing}>
                                    {t('admin.complete_order') || 'Complete order'}
                                </PrimaryButton>
                            </form>
                        )}

                        {order.can_fail && (
                            <form onSubmit={submitFail} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
                                <h3 className="text-sm font-semibold text-red-300">{t('admin.fail_order') || 'Fail order'}</h3>
                                <div className="mt-3">
                                    <InputLabel htmlFor="fail_note" value={t('admin.admin_note') || 'Admin note (optional)'} />
                                    <textarea
                                        id="fail_note"
                                        className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                                        value={failForm.data.admin_note}
                                        onChange={(e) => failForm.setData('admin_note', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <DangerButton type="submit" className="mt-3 w-full justify-center" disabled={failForm.processing}>
                                    {t('admin.fail') || 'Fail'}
                                </DangerButton>
                            </form>
                        )}

                        {order.can_cancel && (
                            <form onSubmit={submitCancel} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
                                <h3 className="text-sm font-semibold text-slate-300">{t('admin.cancel_order') || 'Cancel order'}</h3>
                                <div className="mt-3">
                                    <InputLabel htmlFor="cancel_note" value={t('admin.admin_note') || 'Admin note (optional)'} />
                                    <textarea
                                        id="cancel_note"
                                        className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                                        value={cancelForm.data.admin_note}
                                        onChange={(e) => cancelForm.setData('admin_note', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={cancelForm.processing}
                                    className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-navy-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200 hover:bg-navy-700 disabled:opacity-25"
                                >
                                    {t('admin.cancel') || 'Cancel'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <form onSubmit={submitNote} className="rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <h3 className="text-sm font-semibold text-white">{t('admin.internal_note') || 'Internal note'}</h3>
                    <div className="mt-3">
                        <TextInput
                            className="block w-full"
                            value={noteForm.data.admin_note}
                            onChange={(e) => noteForm.setData('admin_note', e.target.value)}
                            placeholder={t('admin.note_placeholder') || 'Visible to admins only'}
                        />
                    </div>
                    <PrimaryButton type="submit" className="mt-4" disabled={noteForm.processing}>
                        {t('common.save') || 'Save note'}
                    </PrimaryButton>
                </form>
            </div>
        </AdminLayout>
    );
}

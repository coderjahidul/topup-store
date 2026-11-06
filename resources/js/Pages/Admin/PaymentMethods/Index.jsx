import PaginationBar from '@/Components/PaginationBar';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function PaymentMethodsIndex({ payment_methods: paymentMethodsSnake, paymentMethods }) {
    const { t } = useTrans();
    const list = paymentMethods ?? paymentMethodsSnake;

    return (
        <AdminLayout title={t('nav.payment_methods') || 'Payment methods'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.payment_methods') || 'Payment methods'}</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            {t('admin.payment_methods_hint') || 'Customer-facing payment channels and limits.'}
                        </p>
                    </div>
                    <Link
                        href={route('admin.payment-methods.create')}
                        className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:brightness-110"
                    >
                        {t('common.create') || 'Create'}
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[1100px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">{t('admin.name') || 'Name'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.code') || 'Code'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.account') || 'Account'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.limits') || 'Min / Max'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.charge') || 'Charge %'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.sort') || 'Sort'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Active'}</th>
                                <th className="px-4 py-3 font-medium text-end">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(list?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No methods.'}
                                    </td>
                                </tr>
                            )}
                            {(list?.data ?? []).map((method) => (
                                <tr key={method.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 font-medium text-white">{method.name}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-cyan-200">{method.code}</td>
                                    <td className="max-w-[200px] px-4 py-3 text-xs">
                                        <div className="text-slate-300">{method.account_number}</div>
                                        <div className="text-slate-500 capitalize">{method.account_type}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                                        {method.min_amount != null
                                            ? `${t('common.bdt')}${Number(method.min_amount).toLocaleString('en-BD')}`
                                            : '—'}
                                        {' / '}
                                        {method.max_amount != null
                                            ? `${t('common.bdt')}${Number(method.max_amount).toLocaleString('en-BD')}`
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 tabular-nums">
                                        {method.charge_percent != null ? `${method.charge_percent}%` : '—'}
                                    </td>
                                    <td className="px-4 py-3 tabular-nums">{method.sort_order ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                method.is_active
                                                    ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/25'
                                                    : 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/25'
                                            }`}
                                        >
                                            {method.is_active ? t('common.yes') || 'Yes' : t('common.no') || 'No'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <Link
                                            href={route('admin.payment-methods.edit', method.id)}
                                            className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-white/5"
                                        >
                                            {t('common.edit') || 'Edit'}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={list?.links} />
            </div>
        </AdminLayout>
    );
}

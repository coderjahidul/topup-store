import PaginationBar from '@/Components/PaginationBar';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function CouponsIndex({ coupons }) {
    const { t } = useTrans();

    return (
        <AdminLayout title={t('nav.coupons') || 'Coupons'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.coupons') || 'Coupons'}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.coupons_hint') || 'Promo codes and discount rules.'}</p>
                    </div>
                    <Link
                        href={route('admin.coupons.create')}
                        className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:brightness-110"
                    >
                        {t('common.create') || 'Create'}
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[1000px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">{t('admin.code') || 'Code'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.type') || 'Type'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.value') || 'Value'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.min_order') || 'Min order'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.usage') || 'Usage'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.expires') || 'Expires'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Active'}</th>
                                <th className="px-4 py-3 font-medium text-end">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(coupons?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No coupons.'}
                                    </td>
                                </tr>
                            )}
                            {(coupons?.data ?? []).map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 font-mono text-sm text-cyan-200">{coupon.code}</td>
                                    <td className="px-4 py-3 capitalize">{coupon.type}</td>
                                    <td className="px-4 py-3">
                                        {coupon.type === 'percent'
                                            ? `${coupon.value}%`
                                            : `${t('common.bdt')}${Number(coupon.value ?? 0).toLocaleString('en-BD')}`}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {coupon.min_order_amount != null
                                            ? `${t('common.bdt')}${Number(coupon.min_order_amount).toLocaleString('en-BD')}`
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-400">
                                        {coupon.usage_limit != null ? `${coupon.used ?? 0}/${coupon.usage_limit}` : `${coupon.used ?? 0}/∞`}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-xs">{coupon.expires_at ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                coupon.is_active
                                                    ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/25'
                                                    : 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/25'
                                            }`}
                                        >
                                            {coupon.is_active ? t('common.yes') || 'Yes' : t('common.no') || 'No'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <Link
                                            href={route('admin.coupons.edit', coupon.id)}
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

                <PaginationBar links={coupons?.links} />
            </div>
        </AdminLayout>
    );
}

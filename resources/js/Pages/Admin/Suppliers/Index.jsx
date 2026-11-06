import PaginationBar from '@/Components/PaginationBar';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function SuppliersIndex({ suppliers }) {
    const { t } = useTrans();

    return (
        <AdminLayout title={t('nav.suppliers') || 'Suppliers'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.suppliers') || 'Suppliers'}</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            {t('admin.suppliers_hint') || 'Manual and API drivers for order fulfillment.'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.supplier-logs.index')}
                            className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                        >
                            {t('nav.supplier_logs') || 'Logs'}
                        </Link>
                        <Link href={route('admin.suppliers.create')}>
                            <PrimaryButton type="button">{t('common.create') || 'Create'}</PrimaryButton>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="min-w-full divide-y divide-white/10 text-sm">
                        <thead className="bg-navy-900/80 text-left text-xs uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Driver</th>
                                <th className="px-4 py-3">Balance</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(suppliers?.data ?? []).map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 font-medium text-white">{supplier.name}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-300">{supplier.code}</td>
                                    <td className="px-4 py-3 text-slate-300">{supplier.driver}</td>
                                    <td className="px-4 py-3 text-cyan-300">
                                        {t('common.bdt')}
                                        {Number(supplier.balance_cache ?? 0).toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs ${
                                                supplier.is_active
                                                    ? 'bg-emerald-500/15 text-emerald-300'
                                                    : 'bg-slate-500/20 text-slate-400'
                                            }`}
                                        >
                                            {supplier.is_active ? 'active' : 'inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button
                                                type="button"
                                                className="rounded-lg border border-white/15 px-2.5 py-1 text-xs hover:bg-white/5"
                                                onClick={() =>
                                                    router.post(route('admin.suppliers.sync-balance', supplier.id))
                                                }
                                            >
                                                Sync balance
                                            </button>
                                            <Link
                                                href={route('admin.suppliers.edit', supplier.id)}
                                                className="rounded-lg border border-cyan-400/30 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/10"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={suppliers?.links} />
            </div>
        </AdminLayout>
    );
}

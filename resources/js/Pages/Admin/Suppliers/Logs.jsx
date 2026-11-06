import PaginationBar from '@/Components/PaginationBar';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function SupplierLogs({ logs, filters }) {
    const { t } = useTrans();

    return (
        <AdminLayout title={t('nav.supplier_logs') || 'Supplier logs'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.supplier_logs') || 'Supplier logs'}</h2>
                        <p className="mt-1 text-sm text-slate-400">Every supplier API/manual call is recorded here.</p>
                    </div>
                    <Link href={route('admin.suppliers.index')} className="text-sm text-cyan-300">
                        ← Suppliers
                    </Link>
                </div>

                <div className="space-y-3">
                    {(logs?.data ?? []).map((log) => (
                        <div key={log.id} className="rounded-xl border border-white/10 bg-navy-900/40 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                <div className="font-medium text-white">
                                    #{log.id} · {log.supplier || '—'} · {log.order_number || 'no order'}
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <span
                                        className={
                                            log.status === 'success' ? 'text-emerald-300' : 'text-red-300'
                                        }
                                    >
                                        {log.status}
                                    </span>
                                    <span className="text-slate-500">{log.created_at}</span>
                                </div>
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <pre className="overflow-x-auto rounded-lg bg-black/30 p-3 text-[11px] text-slate-300">
                                    {JSON.stringify(log.request, null, 2)}
                                </pre>
                                <pre className="overflow-x-auto rounded-lg bg-black/30 p-3 text-[11px] text-slate-300">
                                    {JSON.stringify(log.response, null, 2)}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>

                <PaginationBar links={logs?.links} />
            </div>
        </AdminLayout>
    );
}

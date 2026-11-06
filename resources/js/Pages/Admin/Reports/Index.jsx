import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function ReportsIndex({ report, filters }) {
    const { t } = useTrans();
    const { data, setData, get, processing } = useForm({
        from: filters?.from ?? '',
        to: filters?.to ?? '',
    });

    const apply = (e) => {
        e.preventDefault();
        get(route('admin.reports.index'), { preserveState: true, replace: true });
    };

    const qs = `?from=${encodeURIComponent(data.from)}&to=${encodeURIComponent(data.to)}`;

    const kpis = [
        { label: 'Sales', value: report?.sales },
        { label: 'Profit', value: report?.profit },
        { label: 'Orders', value: report?.orders_count, plain: true },
        { label: 'Paid orders', value: report?.paid_orders, plain: true },
        { label: 'Wallet credits', value: report?.wallet_credits },
        { label: 'Wallet debits', value: report?.wallet_debits },
    ];

    return (
        <AdminLayout title={t('nav.reports') || 'Reports'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.reports') || 'Reports'}</h2>
                        <p className="mt-1 text-sm text-slate-400">Sales, profit, wallet ledger — export Excel or PDF.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a
                            href={route('admin.reports.sales.excel') + qs}
                            className="rounded-lg border border-cyan-400/30 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/10"
                        >
                            Sales Excel
                        </a>
                        <a
                            href={route('admin.reports.wallet.excel') + qs}
                            className="rounded-lg border border-cyan-400/30 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/10"
                        >
                            Wallet Excel
                        </a>
                        <a
                            href={route('admin.reports.sales.pdf') + qs}
                            className="rounded-lg border border-violet-400/30 px-3 py-2 text-sm text-violet-300 hover:bg-violet-500/10"
                        >
                            Sales PDF
                        </a>
                    </div>
                </div>

                <form onSubmit={apply} className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-navy-900/40 p-4">
                    <div>
                        <InputLabel value="From" />
                        <TextInput
                            type="date"
                            className="mt-1"
                            value={data.from}
                            onChange={(e) => setData('from', e.target.value)}
                        />
                    </div>
                    <div>
                        <InputLabel value="To" />
                        <TextInput
                            type="date"
                            className="mt-1"
                            value={data.to}
                            onChange={(e) => setData('to', e.target.value)}
                        />
                    </div>
                    <PrimaryButton disabled={processing}>Apply</PrimaryButton>
                    <button
                        type="button"
                        className="text-sm text-slate-400 hover:text-white"
                        onClick={() => router.get(route('admin.reports.index'))}
                    >
                        Reset
                    </button>
                </form>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {kpis.map((kpi) => (
                        <div key={kpi.label} className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
                            <div className="text-xs uppercase tracking-wider text-slate-500">{kpi.label}</div>
                            <div className="mt-2 text-2xl font-semibold text-cyan-300">
                                {kpi.plain
                                    ? Number(kpi.value ?? 0).toLocaleString('en-BD')
                                    : `${t('common.bdt')}${Number(kpi.value ?? 0).toLocaleString('en-BD')}`}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4">
                        <h3 className="text-sm font-semibold text-white">By game</h3>
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="text-left text-xs text-slate-500">
                                    <tr>
                                        <th className="py-2">Game</th>
                                        <th className="py-2">Orders</th>
                                        <th className="py-2">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(report?.by_game ?? []).map((row) => (
                                        <tr key={row.game}>
                                            <td className="py-2 text-slate-200">{row.game}</td>
                                            <td className="py-2">{row.orders}</td>
                                            <td className="py-2 text-cyan-300">
                                                {t('common.bdt')}
                                                {Number(row.revenue).toLocaleString('en-BD')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4">
                        <h3 className="text-sm font-semibold text-white">By user</h3>
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="text-left text-xs text-slate-500">
                                    <tr>
                                        <th className="py-2">User</th>
                                        <th className="py-2">Orders</th>
                                        <th className="py-2">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(report?.by_user ?? []).map((row) => (
                                        <tr key={row.user_id}>
                                            <td className="py-2">
                                                <div className="text-slate-200">{row.name}</div>
                                                <div className="text-xs text-slate-500">{row.phone}</div>
                                            </td>
                                            <td className="py-2">{row.orders}</td>
                                            <td className="py-2 text-cyan-300">
                                                {t('common.bdt')}
                                                {Number(row.revenue).toLocaleString('en-BD')}
                                            </td>
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

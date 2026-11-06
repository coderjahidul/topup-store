import AdminLayout from '@/Layouts/AdminLayout';
import useTrans from '@/hooks/useTrans';

function formatMoney(t, value) {
    const n = Number(value ?? 0);
    return `${t('common.bdt')}${n.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function Dashboard({ stats }) {
    const { t } = useTrans();

    const safeStats = {
        today_sales: stats?.today_sales ?? 0,
        week_sales: stats?.week_sales ?? 0,
        month_sales: stats?.month_sales ?? 0,
        profit_month: stats?.profit_month ?? 0,
        pending_orders: stats?.pending_orders ?? 0,
        processing_orders: stats?.processing_orders ?? 0,
        pending_add_money: stats?.pending_add_money ?? 0,
        new_users_month: stats?.new_users_month ?? 0,
        top_games: Array.isArray(stats?.top_games) ? stats.top_games : [],
        sales_chart: Array.isArray(stats?.sales_chart) ? stats.sales_chart : [],
    };

    const chartMax = Math.max(...safeStats.sales_chart.map((row) => Number(row.total ?? 0)), 1);

    const kpi = [
        {
            label: t('admin.kpi.today_sales') || "Today's sales",
            value: formatMoney(t, safeStats.today_sales),
        },
        {
            label: t('admin.kpi.week_sales') || 'Week sales',
            value: formatMoney(t, safeStats.week_sales),
        },
        {
            label: t('admin.kpi.month_sales') || 'Month sales',
            value: formatMoney(t, safeStats.month_sales),
        },
        {
            label: t('admin.kpi.profit_month') || 'Month profit',
            value: formatMoney(t, safeStats.profit_month),
        },
        {
            label: t('admin.kpi.pending_orders') || 'Pending orders',
            value: String(safeStats.pending_orders),
        },
        {
            label: t('admin.kpi.processing_orders') || 'Processing',
            value: String(safeStats.processing_orders),
        },
        {
            label: t('admin.kpi.pending_add_money') || 'Pending add money',
            value: String(safeStats.pending_add_money),
        },
        {
            label: t('admin.kpi.new_users') || 'New users (month)',
            value: String(safeStats.new_users_month),
        },
    ];

    return (
        <AdminLayout title={t('nav.dashboard') || 'Dashboard'}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">{t('nav.dashboard') || 'Dashboard'}</h2>
                    <p className="mt-1 text-sm text-slate-400">{t('admin.dashboard_subtitle') || 'Overview and performance at a glance.'}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {kpi.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-xl border border-white/10 bg-navy-900/50 p-4 shadow-sm ring-1 ring-white/5"
                        >
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                            <p className="mt-2 text-lg font-semibold text-cyan-200">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4">
                        <h3 className="text-sm font-semibold text-white">{t('admin.top_games') || 'Top games'}</h3>
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                                <thead>
                                    <tr className="text-slate-400">
                                        <th className="pb-2 pe-4 font-medium">{t('nav.games') || 'Game'}</th>
                                        <th className="pb-2 pe-4 font-medium">{t('admin.orders') || 'Orders'}</th>
                                        <th className="pb-2 font-medium">{t('admin.revenue') || 'Revenue'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {safeStats.top_games.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-6 text-center text-slate-500">
                                                {t('common.empty') || 'No data yet.'}
                                            </td>
                                        </tr>
                                    )}
                                    {safeStats.top_games.map((row, index) => (
                                        <tr key={`${row.name}-${index}`} className="text-slate-200">
                                            <td className="py-2 pe-4">{row.name}</td>
                                            <td className="py-2 pe-4">{row.orders ?? '—'}</td>
                                            <td className="py-2">{formatMoney(t, row.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4">
                        <h3 className="text-sm font-semibold text-white">{t('admin.sales_trend') || 'Sales trend'}</h3>
                        <p className="mt-1 text-xs text-slate-500">{t('admin.sales_trend_hint') || 'Daily totals (recent period)'}</p>
                        <div className="mt-4 space-y-2">
                            {safeStats.sales_chart.length === 0 && (
                                <p className="py-4 text-center text-sm text-slate-500">{t('common.empty') || 'No chart data.'}</p>
                            )}
                            {safeStats.sales_chart.map((row) => {
                                const total = Number(row.total ?? 0);
                                const width = Math.max(4, Math.round((total / chartMax) * 100));
                                return (
                                    <div key={row.date} className="flex items-center gap-3 text-xs sm:text-sm">
                                        <span className="w-24 shrink-0 text-slate-400">{row.date}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="h-6 overflow-hidden rounded bg-white/5">
                                                <div
                                                    className="h-full rounded bg-gradient-to-r from-cyan-500/80 to-violet-500/70"
                                                    style={{ width: `${width}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="w-28 shrink-0 text-end font-medium text-cyan-200 tabular-nums">
                                            {formatMoney(t, total)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

import AdminLayout from '@/Layouts/AdminLayout';
import useTrans from '@/hooks/useTrans';
import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

function formatMoney(t, value) {
    const n = Number(value ?? 0);
    return `${t('common.bdt')}${n.toLocaleString('en-BD', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

function formatShortDate(value) {
    if (!value) {
        return '—';
    }

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function buildChartSeries(rows) {
    const byDate = new Map((rows || []).map((row) => [String(row.date), Number(row.total ?? 0)]));
    const series = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    cursor.setDate(cursor.getDate() - 13);

    for (let i = 0; i < 14; i += 1) {
        const key = cursor.toISOString().slice(0, 10);
        series.push({
            date: key,
            total: byDate.get(key) ?? 0,
        });
        cursor.setDate(cursor.getDate() + 1);
    }

    return series;
}

function KpiCard({ label, value, hint, tone = 'cyan', accent }) {
    const tones = {
        cyan: 'from-cyan-500/20 via-cyan-400/5 to-transparent text-cyan-200 ring-cyan-400/20',
        teal: 'from-teal-500/20 via-teal-400/5 to-transparent text-teal-200 ring-teal-400/20',
        amber: 'from-amber-500/20 via-amber-400/5 to-transparent text-amber-200 ring-amber-400/20',
        violet: 'from-violet-500/20 via-violet-400/5 to-transparent text-violet-200 ring-violet-400/20',
        rose: 'from-rose-500/20 via-rose-400/5 to-transparent text-rose-200 ring-rose-400/20',
        orange: 'from-orange-500/20 via-orange-400/5 to-transparent text-orange-200 ring-orange-400/20',
        slate: 'from-slate-500/20 via-slate-400/5 to-transparent text-slate-200 ring-slate-400/20',
        emerald: 'from-emerald-500/20 via-emerald-400/5 to-transparent text-emerald-200 ring-emerald-400/20',
    };

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60 p-4 shadow-lg shadow-black/20 ring-1 ${tones[tone] || tones.cyan}`}
        >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tones[tone] || tones.cyan}`} />
            <div className="relative">
                <div className="flex items-start justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                    {accent && (
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300 ring-1 ring-white/10">
                            {accent}
                        </span>
                    )}
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-white tabular-nums">{value}</p>
                {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
            </div>
        </div>
    );
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

    const chartSeries = useMemo(() => buildChartSeries(safeStats.sales_chart), [safeStats.sales_chart]);
    const chartMax = Math.max(...chartSeries.map((row) => row.total), 1);
    const topRevenue = Math.max(...safeStats.top_games.map((row) => Number(row.revenue ?? 0)), 1);

    const attentionItems = [
        {
            key: 'pending_orders',
            count: safeStats.pending_orders,
            label: t('admin.attention.pending_orders') || 'Pending orders',
            href: route('admin.orders.index', { status: 'pending' }),
            tone: 'bg-amber-400',
        },
        {
            key: 'processing_orders',
            count: safeStats.processing_orders,
            label: t('admin.attention.processing_orders') || 'Processing orders',
            href: route('admin.orders.index', { status: 'processing' }),
            tone: 'bg-cyan-400',
        },
        {
            key: 'pending_add_money',
            count: safeStats.pending_add_money,
            label: t('admin.attention.pending_add_money') || 'Add-money requests',
            href: route('admin.add-money.index'),
            tone: 'bg-orange-400',
        },
    ].filter((item) => Number(item.count) > 0);

    const quickActions = [
        {
            key: 'orders',
            href: route('admin.orders.index'),
            title: t('admin.quick.orders') || 'Manage orders',
            hint: t('admin.quick.orders_hint') || 'Review, complete, or fail top-ups',
        },
        {
            key: 'add-money',
            href: route('admin.add-money.index'),
            title: t('admin.quick.add_money') || 'Approve wallet top-ups',
            hint: t('admin.quick.add_money_hint') || 'Verify TrxID and credit balances',
        },
        {
            key: 'games',
            href: route('admin.games.index'),
            title: t('admin.quick.catalog') || 'Update catalog',
            hint: t('admin.quick.catalog_hint') || 'Games, packages, and pricing',
        },
        {
            key: 'reports',
            href: route('admin.reports.index'),
            title: t('admin.quick.reports') || 'Open reports',
            hint: t('admin.quick.reports_hint') || 'Sales, profit, and wallet ledger',
        },
    ];

    const todayLabel = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <AdminLayout title={t('nav.dashboard') || 'Dashboard'}>
            <div className="space-y-8">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl animate-fade-up">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                            {t('admin.dashboard_kicker') || 'Business overview'}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {t('admin.dashboard_title') || 'Dashboard'}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                            {t('admin.dashboard_subtitle') ||
                                'Track sales, queue health, and top games from one calm operations view.'}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {t('admin.today') || 'Today'}
                        </p>
                        <p className="mt-1 font-medium text-white">{todayLabel}</p>
                    </div>
                </section>

                {attentionItems.length > 0 && (
                    <section className="animate-fade-up rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-amber-100">
                                    {t('admin.attention_title') || 'Needs attention'}
                                </h3>
                                <p className="mt-1 text-xs text-amber-100/70">
                                    {t('admin.attention_hint') || 'Jump into queues that are waiting on staff.'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {attentionItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-navy-950/50 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:border-amber-300/40 hover:text-white"
                                    >
                                        <span className={`h-2 w-2 rounded-full ${item.tone}`} />
                                        {item.label}
                                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 tabular-nums">
                                            {item.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        label={t('admin.kpi.today_sales') || "Today's sales"}
                        value={formatMoney(t, safeStats.today_sales)}
                        hint={t('admin.kpi.today_sales_hint') || 'Paid orders today'}
                        tone="cyan"
                        accent={t('admin.kpi.live') || 'Live'}
                    />
                    <KpiCard
                        label={t('admin.kpi.week_sales') || 'Week sales'}
                        value={formatMoney(t, safeStats.week_sales)}
                        hint={t('admin.kpi.week_sales_hint') || 'Since week start'}
                        tone="teal"
                    />
                    <KpiCard
                        label={t('admin.kpi.month_sales') || 'Month sales'}
                        value={formatMoney(t, safeStats.month_sales)}
                        hint={t('admin.kpi.month_sales_hint') || 'Month to date'}
                        tone="violet"
                    />
                    <KpiCard
                        label={t('admin.kpi.profit_month') || 'Month profit'}
                        value={formatMoney(t, safeStats.profit_month)}
                        hint={t('admin.kpi.profit_month_hint') || 'After package cost'}
                        tone="emerald"
                    />
                    <KpiCard
                        label={t('admin.kpi.pending_orders') || 'Pending orders'}
                        value={String(safeStats.pending_orders)}
                        hint={t('admin.kpi.pending_orders_hint') || 'Awaiting fulfillment'}
                        tone="amber"
                    />
                    <KpiCard
                        label={t('admin.kpi.processing_orders') || 'Processing'}
                        value={String(safeStats.processing_orders)}
                        hint={t('admin.kpi.processing_orders_hint') || 'In progress now'}
                        tone="cyan"
                    />
                    <KpiCard
                        label={t('admin.kpi.pending_add_money') || 'Pending add money'}
                        value={String(safeStats.pending_add_money)}
                        hint={t('admin.kpi.pending_add_money_hint') || 'Wallet approvals'}
                        tone="orange"
                    />
                    <KpiCard
                        label={t('admin.kpi.new_users') || 'New users (month)'}
                        value={String(safeStats.new_users_month)}
                        hint={t('admin.kpi.new_users_hint') || 'Registered this month'}
                        tone="slate"
                    />
                </section>

                <section className="grid gap-6 xl:grid-cols-5">
                    <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-5 shadow-lg shadow-black/10 xl:col-span-3">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h3 className="text-base font-semibold text-white">
                                    {t('admin.sales_trend') || 'Sales trend'}
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {t('admin.sales_trend_hint') || 'Daily paid totals · last 14 days'}
                                </p>
                            </div>
                            <Link
                                href={route('admin.reports.index')}
                                className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                            >
                                {t('admin.view_reports') || 'View reports'} →
                            </Link>
                        </div>

                        <div className="mt-6 flex h-52 items-end gap-1.5 sm:gap-2">
                            {chartSeries.map((row) => {
                                const height = Math.max(6, Math.round((row.total / chartMax) * 100));
                                return (
                                    <div key={row.date} className="group flex min-w-0 flex-1 flex-col items-center gap-2">
                                        <div className="relative flex h-40 w-full items-end justify-center">
                                            <div
                                                className="w-full max-w-[1.75rem] rounded-t-lg bg-gradient-to-t from-cyan-500/90 to-teal-300/70 shadow-[0_0_18px_rgba(34,211,238,0.18)] transition duration-300 group-hover:from-cyan-400 group-hover:to-white/80"
                                                style={{ height: `${height}%` }}
                                                title={formatMoney(t, row.total)}
                                            />
                                            <span className="pointer-events-none absolute -top-7 hidden rounded-md bg-navy-950 px-1.5 py-0.5 text-[10px] font-medium text-cyan-100 ring-1 ring-white/10 group-hover:block">
                                                {formatMoney(t, row.total)}
                                            </span>
                                        </div>
                                        <span className="truncate text-[10px] text-slate-500 sm:text-[11px]">
                                            {formatShortDate(row.date)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-5 shadow-lg shadow-black/10 xl:col-span-2">
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                <h3 className="text-base font-semibold text-white">
                                    {t('admin.top_games') || 'Top games'}
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {t('admin.top_games_hint') || 'By revenue this month'}
                                </p>
                            </div>
                            <Link
                                href={route('admin.games.index')}
                                className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                            >
                                {t('nav.games') || 'Games'} →
                            </Link>
                        </div>

                        <div className="mt-5 space-y-3">
                            {safeStats.top_games.length === 0 && (
                                <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                                    <p className="text-sm text-slate-400">{t('common.empty') || 'No data yet.'}</p>
                                    <p className="mt-1 text-xs text-slate-600">
                                        {t('admin.top_games_empty') || 'Paid orders will appear here.'}
                                    </p>
                                </div>
                            )}

                            {safeStats.top_games.map((row, index) => {
                                const revenue = Number(row.revenue ?? 0);
                                const width = Math.max(8, Math.round((revenue / topRevenue) * 100));

                                return (
                                    <div
                                        key={`${row.name}-${index}`}
                                        className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-300 ring-1 ring-cyan-400/20">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="truncate text-sm font-medium text-slate-100">{row.name}</p>
                                                    <p className="shrink-0 text-sm font-semibold tabular-nums text-cyan-200">
                                                        {formatMoney(t, revenue)}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {row.orders ?? 0} {t('admin.orders') || 'orders'}
                                                </p>
                                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-300"
                                                        style={{ width: `${width}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mb-3 flex items-end justify-between gap-3">
                        <div>
                            <h3 className="text-base font-semibold text-white">
                                {t('admin.quick_actions') || 'Quick actions'}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                {t('admin.quick_actions_hint') || 'Common tasks for daily operations'}
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.key}
                                href={action.href}
                                className="group rounded-2xl border border-white/10 bg-navy-900/40 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-navy-900/70 hover:shadow-lg hover:shadow-cyan-500/5"
                            >
                                <p className="text-sm font-semibold text-white group-hover:text-cyan-100">{action.title}</p>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500">{action.hint}</p>
                                <p className="mt-4 text-xs font-semibold text-cyan-400 opacity-80 transition group-hover:opacity-100">
                                    {t('admin.open') || 'Open'} →
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

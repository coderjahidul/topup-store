import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import Toast from '@/Components/Toast';
import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';

const navGroups = [
    {
        key: 'overview',
        labelKey: 'admin.nav.overview',
        fallback: 'Overview',
        items: [
            { key: 'dashboard', routeName: 'admin.dashboard', activeAs: 'admin.dashboard', labelKey: 'nav.dashboard', fallback: 'Dashboard' },
            { key: 'reports', routeName: 'admin.reports.index', activeAs: 'admin.reports.*', labelKey: 'nav.reports', fallback: 'Reports' },
            { key: 'activity', routeName: 'admin.activity.index', activeAs: 'admin.activity.*', labelKey: 'nav.activity_log', fallback: 'Activity log' },
        ],
    },
    {
        key: 'operations',
        labelKey: 'admin.nav.operations',
        fallback: 'Operations',
        items: [
            { key: 'orders', routeName: 'admin.orders.index', activeAs: 'admin.orders.*', labelKey: 'nav.orders', fallback: 'Orders' },
            { key: 'add-money', routeName: 'admin.add-money.index', activeAs: 'admin.add-money.*', labelKey: 'nav.add_money', fallback: 'Add Money' },
            { key: 'users', routeName: 'admin.users.index', activeAs: 'admin.users.*', labelKey: 'nav.users', fallback: 'Users' },
            { key: 'reviews', routeName: 'admin.reviews.index', activeAs: 'admin.reviews.*', labelKey: 'nav.reviews', fallback: 'Reviews' },
        ],
    },
    {
        key: 'catalog',
        labelKey: 'admin.nav.catalog',
        fallback: 'Catalog',
        items: [
            { key: 'games', routeName: 'admin.games.index', activeAs: 'admin.games.*', labelKey: 'nav.games', fallback: 'Games' },
            { key: 'packages', routeName: 'admin.packages.index', activeAs: 'admin.packages.*', labelKey: 'nav.packages', fallback: 'Packages' },
            { key: 'coupons', routeName: 'admin.coupons.index', activeAs: 'admin.coupons.*', labelKey: 'nav.coupons', fallback: 'Coupons' },
            { key: 'banners', routeName: 'admin.banners.index', activeAs: 'admin.banners.*', labelKey: 'nav.banners', fallback: 'Banners' },
            { key: 'notices', routeName: 'admin.notices.index', activeAs: 'admin.notices.*', labelKey: 'nav.notices', fallback: 'Notices' },
        ],
    },
    {
        key: 'integrations',
        labelKey: 'admin.nav.integrations',
        fallback: 'Integrations',
        items: [
            {
                key: 'payment-methods',
                routeName: 'admin.payment-methods.index',
                activeAs: 'admin.payment-methods.*',
                labelKey: 'nav.payment_methods',
                fallback: 'Payment methods',
            },
            { key: 'suppliers', routeName: 'admin.suppliers.index', activeAs: 'admin.suppliers.*', labelKey: 'nav.suppliers', fallback: 'Suppliers' },
            {
                key: 'supplier-logs',
                routeName: 'admin.supplier-logs.index',
                activeAs: 'admin.supplier-logs.*',
                labelKey: 'nav.supplier_logs',
                fallback: 'Supplier logs',
            },
        ],
    },
    {
        key: 'system',
        labelKey: 'admin.nav.system',
        fallback: 'System',
        items: [
            { key: 'settings', routeName: 'admin.settings.edit', activeAs: 'admin.settings.*', labelKey: 'nav.settings', fallback: 'Settings' },
        ],
    },
];

function initials(name = '') {
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || '')
            .join('') || '?'
    );
}

export default function AdminLayout({ title, children }) {
    const { auth, appName } = usePage().props;
    const { t } = useTrans();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const activeLabel = useMemo(() => {
        for (const group of navGroups) {
            for (const item of group.items) {
                if (route().current(item.activeAs)) {
                    return t(item.labelKey) || item.fallback;
                }
            }
        }
        return title;
    }, [title, t]);

    return (
        <div className="min-h-screen bg-navy-950 text-slate-100">
            <Head title={title ? `${title} · Admin · ${appName}` : `Admin · ${appName}`} />
            <Toast />

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex min-h-screen">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 flex w-[17.5rem] flex-col border-r border-white/10 bg-gradient-to-b from-navy-900 to-navy-950 transition duration-200 lg:static lg:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
                        <Link
                            href={route('admin.dashboard')}
                            className="flex min-w-0 items-center gap-2.5"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-400/30">
                                <ApplicationLogo className="h-5 w-5 fill-cyan-300" />
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold tracking-wide text-white">
                                    {appName || 'TopUp Store'}
                                </span>
                                <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-400/80">
                                    {t('nav.admin') || 'Admin'}
                                </span>
                            </span>
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 pb-8">
                        {navGroups.map((group) => (
                            <div key={group.key}>
                                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {t(group.labelKey) || group.fallback}
                                </p>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => {
                                        const href = route(item.routeName);
                                        const active = route().current(item.activeAs);
                                        const label = t(item.labelKey) || item.fallback;

                                        return (
                                            <Link
                                                key={item.key}
                                                href={href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                                                    active
                                                        ? 'bg-cyan-500/15 font-medium text-cyan-200 shadow-[inset_3px_0_0_0_rgb(34_211_238)] ring-1 ring-cyan-400/20'
                                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        active ? 'bg-cyan-300' : 'bg-slate-600 group-hover:bg-slate-400'
                                                    }`}
                                                />
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className="border-t border-white/10 p-3">
                        <Link
                            href={route('home')}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-200"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span>{t('admin.view_storefront') || 'View storefront'}</span>
                            <span aria-hidden="true" className="text-cyan-400">
                                ↗
                            </span>
                        </Link>
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-navy-950/85 px-4 backdrop-blur-xl sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/10 lg:hidden"
                                onClick={() => setSidebarOpen((value) => !value)}
                            >
                                {t('common.menu') || 'Menu'}
                            </button>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white sm:text-base">
                                    {title || activeLabel}
                                </p>
                                <p className="hidden text-xs text-slate-500 sm:block">
                                    {t('admin.console') || 'Operations console'}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <LanguageSwitcher />
                            <div className="hidden h-8 w-px bg-white/10 sm:block" />
                            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1 pe-3 ps-1">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-teal-500/20 text-xs font-bold text-cyan-100 ring-1 ring-cyan-400/20">
                                    {initials(auth.user?.name)}
                                </span>
                                <div className="hidden min-w-0 sm:block">
                                    <p className="max-w-[9rem] truncate text-xs font-semibold text-slate-100">
                                        {auth.user?.name}
                                    </p>
                                    <p className="max-w-[9rem] truncate text-[10px] text-slate-500">{auth.user?.email}</p>
                                </div>
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-xl border border-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:border-rose-400/30 hover:text-rose-300"
                            >
                                {t('nav.logout') || 'Log out'}
                            </Link>
                        </div>
                    </header>

                    <main className="relative flex-1 overflow-x-hidden">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.08),_transparent_60%)]"
                        />
                        <div className="relative mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}

import LanguageSwitcher from '@/Components/LanguageSwitcher';
import Toast from '@/Components/Toast';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useTrans from '@/hooks/useTrans';

const navItems = [
    { key: 'dashboard', routeName: 'admin.dashboard', activeAs: 'admin.dashboard', labelKey: 'nav.dashboard', fallback: 'Dashboard' },
    { key: 'orders', routeName: 'admin.orders.index', activeAs: 'admin.orders.*', labelKey: 'nav.orders', fallback: 'Orders' },
    { key: 'add-money', routeName: 'admin.add-money.index', activeAs: 'admin.add-money.*', labelKey: 'nav.add_money', fallback: 'Add Money' },
    { key: 'games', routeName: 'admin.games.index', activeAs: 'admin.games.*', labelKey: 'nav.games', fallback: 'Games' },
    { key: 'packages', routeName: 'admin.packages.index', activeAs: 'admin.packages.*', labelKey: 'nav.packages', fallback: 'Packages' },
    { key: 'coupons', routeName: 'admin.coupons.index', activeAs: 'admin.coupons.*', labelKey: 'nav.coupons', fallback: 'Coupons' },
    { key: 'banners', routeName: 'admin.banners.index', activeAs: 'admin.banners.*', labelKey: 'nav.banners', fallback: 'Banners' },
    { key: 'notices', routeName: 'admin.notices.index', activeAs: 'admin.notices.*', labelKey: 'nav.notices', fallback: 'Notices' },
    {
        key: 'payment-methods',
        routeName: 'admin.payment-methods.index',
        activeAs: 'admin.payment-methods.*',
        labelKey: 'nav.payment_methods',
        fallback: 'Payment methods',
    },
    { key: 'users', routeName: 'admin.users.index', activeAs: 'admin.users.*', labelKey: 'nav.users', fallback: 'Users' },
    { key: 'reviews', routeName: 'admin.reviews.index', activeAs: 'admin.reviews.*', labelKey: 'nav.reviews', fallback: 'Reviews' },
    { key: 'reports', routeName: 'admin.reports.index', activeAs: 'admin.reports.*', labelKey: 'nav.reports', fallback: 'Reports' },
    { key: 'suppliers', routeName: 'admin.suppliers.index', activeAs: 'admin.suppliers.*', labelKey: 'nav.suppliers', fallback: 'Suppliers' },
    { key: 'supplier-logs', routeName: 'admin.supplier-logs.index', activeAs: 'admin.supplier-logs.*', labelKey: 'nav.supplier_logs', fallback: 'Supplier logs' },
    { key: 'settings', routeName: 'admin.settings.edit', activeAs: 'admin.settings.*', labelKey: 'nav.settings', fallback: 'Settings' },
    { key: 'activity', routeName: 'admin.activity.index', activeAs: 'admin.activity.*', labelKey: 'nav.activity_log', fallback: 'Activity log' },
];

export default function AdminLayout({ title, children }) {
    const { auth, appName } = usePage().props;
    const { t } = useTrans();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-navy-950 text-slate-100">
            <Head title={title ? `${title} - Admin - ${appName}` : `Admin - ${appName}`} />
            <Toast />

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex min-h-screen">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-navy-900 transition lg:static lg:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-16 items-center border-b border-white/10 px-5">
                        <Link href={route('home')} className="font-bold text-cyan-300" onClick={() => setSidebarOpen(false)}>
                            {t('nav.admin') || 'Admin'}
                        </Link>
                    </div>
                    <nav className="flex max-h-[calc(100vh-4rem)] flex-col gap-0.5 overflow-y-auto p-3 pb-8">
                        {navItems.map((item) => {
                            const href = route(item.routeName);
                            const active = route().current(item.activeAs);
                            const label = t(item.labelKey) || item.fallback;
                            return (
                                <Link
                                    key={item.key}
                                    href={href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`rounded-lg px-3 py-2 text-sm transition ${
                                        active
                                            ? 'bg-cyan-500/15 font-medium text-cyan-300 ring-1 ring-cyan-400/30'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-navy-950/80 px-4 backdrop-blur sm:px-6">
                        <button
                            type="button"
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-200 lg:hidden"
                            onClick={() => setSidebarOpen((value) => !value)}
                        >
                            {t('common.menu') || 'Menu'}
                        </button>
                        {title && (
                            <h1 className="min-w-0 truncate text-sm font-semibold text-slate-200 sm:flex-1 lg:hidden">
                                {title}
                            </h1>
                        )}
                        <div className="ms-auto flex shrink-0 items-center gap-3">
                            <LanguageSwitcher />
                            <span className="hidden max-w-[10rem] truncate text-sm text-slate-300 sm:inline">
                                {auth.user?.name}
                            </span>
                        </div>
                    </header>
                    <main className="flex-1 p-4 sm:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}

import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useTrans from '@/hooks/useTrans';

const navItems = [
    { key: 'dashboard', href: '#', labelKey: 'nav.dashboard' },
    { key: 'orders', href: '#', labelKey: 'nav.orders' },
    { key: 'users', href: '#', labelKey: 'nav.profile' },
];

export default function AdminLayout({ title, children }) {
    const { auth, appName } = usePage().props;
    const { t } = useTrans();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-navy-950 text-slate-100">
            <Head title={title ? `${title} - Admin - ${appName}` : `Admin - ${appName}`} />

            <div className="flex min-h-screen">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-navy-900 transition lg:static lg:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-16 items-center border-b border-white/10 px-5">
                        <Link href={route('home')} className="font-bold text-cyan-300">
                            {t('nav.admin')}
                        </Link>
                    </div>
                    <nav className="flex flex-col gap-1 p-3">
                        {navItems.map((item) => (
                            <a
                                key={item.key}
                                href={item.href}
                                className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                            >
                                {t(item.labelKey)}
                            </a>
                        ))}
                    </nav>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-navy-950/80 px-4 backdrop-blur sm:px-6">
                        <button
                            type="button"
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-200 lg:hidden"
                            onClick={() => setSidebarOpen((value) => !value)}
                        >
                            Menu
                        </button>
                        <div className="ms-auto flex items-center gap-3">
                            <LanguageSwitcher />
                            <span className="text-sm text-slate-300">{auth.user?.name}</span>
                        </div>
                    </header>
                    <main className="flex-1 p-4 sm:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}

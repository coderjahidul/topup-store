import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useTrans from '@/hooks/useTrans';

export default function Navbar() {
    const { auth } = usePage().props;
    const { t } = useTrans();
    const [open, setOpen] = useState(false);

    const links = [
        { href: route('home'), label: t('nav.home'), active: route().current('home') },
        { href: '#games', label: t('nav.games'), active: false },
        { href: '#track', label: t('nav.track_order'), active: false },
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link href={route('home')} className="flex items-center gap-2">
                    <ApplicationLogo className="h-9 w-auto fill-cyan-400" />
                    <span className="text-lg font-bold tracking-tight text-white">
                        {t('app.name')}
                    </span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-sm font-medium transition ${
                                link.active
                                    ? 'text-cyan-300'
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <LanguageSwitcher />
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-navy-950 transition hover:bg-cyan-400"
                        >
                            {t('nav.dashboard')}
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-slate-300 hover:text-white"
                            >
                                {t('nav.login')}
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1.5 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
                            >
                                {t('nav.register')}
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-slate-200 md:hidden"
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    aria-label="Menu"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {open ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {open && (
                <div className="border-t border-white/5 bg-navy-950 px-4 py-4 md:hidden">
                    <div className="flex flex-col gap-3">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-slate-200"
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <LanguageSwitcher />
                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-sm font-semibold text-cyan-300">
                                {t('nav.dashboard')}
                            </Link>
                        ) : (
                            <div className="flex gap-3">
                                <Link href={route('login')} className="text-sm text-slate-300">
                                    {t('nav.login')}
                                </Link>
                                <Link href={route('register')} className="text-sm font-semibold text-cyan-300">
                                    {t('nav.register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

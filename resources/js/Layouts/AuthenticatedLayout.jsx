import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Toast from '@/Components/Toast';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useTrans from '@/hooks/useTrans';

function initials(name = '') {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || '?';
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { t } = useTrans();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const links = [
        { href: route('dashboard'), label: t('nav.dashboard'), active: route().current('dashboard') },
        { href: route('customer.orders.index'), label: t('nav.orders'), active: route().current('customer.orders.*') },
        {
            href: route('customer.transactions'),
            label: t('nav.transactions') || 'Wallet',
            active: route().current('customer.transactions') || route().current('wallet.*'),
        },
        {
            href: route('customer.referrals'),
            label: t('nav.referral') || 'Referral',
            active: route().current('customer.referrals'),
        },
        { href: route('profile.edit'), label: t('nav.profile'), active: route().current('profile.*') },
    ];

    return (
        <div className="min-h-screen bg-navy-950 text-slate-100">
            <Toast />
            <nav className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/85 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-6">
                            <Link href={route('home')} className="flex shrink-0 items-center gap-2">
                                <ApplicationLogo className="block h-8 w-auto fill-cyan-400" />
                                <span className="hidden text-sm font-semibold tracking-wide text-slate-200 sm:inline">
                                    {t('nav.account') || 'My Account'}
                                </span>
                            </Link>

                            <div className="hidden items-center gap-1 lg:flex">
                                {links.map((link) => (
                                    <NavLink key={link.href} href={link.href} active={link.active}>
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                href={route('wallet.add-money')}
                                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                            >
                                <span className="text-[10px] uppercase tracking-wider text-cyan-400/80">
                                    {t('game.wallet_balance') || 'Balance'}
                                </span>
                                <span>
                                    {t('common.bdt')}
                                    {Number(user?.balance ?? 0).toLocaleString('en-BD')}
                                </span>
                            </Link>

                            <Link
                                href={route('wallet.add-money')}
                                className="inline-flex items-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy-950 shadow-md shadow-cyan-500/20 transition hover:brightness-110"
                            >
                                {t('nav.add_money') || 'Add Money'}
                            </Link>

                            <LanguageSwitcher />

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-navy-900 px-2 py-1.5 text-sm text-slate-200 transition hover:border-white/20 hover:bg-navy-800"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-orange-500/20 text-xs font-bold text-cyan-100 ring-1 ring-white/10">
                                            {initials(user?.name)}
                                        </span>
                                        <span className="hidden max-w-[9rem] truncate font-medium md:inline">
                                            {user.name}
                                        </span>
                                        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="border-b border-white/10 px-4 py-3">
                                        <p className="text-sm font-semibold text-white">{user.name}</p>
                                        <p className="text-xs text-slate-400">{user.phone || user.email}</p>
                                    </div>
                                    {user?.can_access_admin && (
                                        <Dropdown.Link href={route('admin.dashboard')}>
                                            {t('nav.admin') || 'Admin'}
                                        </Dropdown.Link>
                                    )}
                                    <Dropdown.Link href={route('home')}>{t('nav.store') || 'Store'}</Dropdown.Link>
                                    <Dropdown.Link href={route('profile.edit')}>{t('nav.profile')}</Dropdown.Link>
                                    <Dropdown.Link href={route('wallet.add-money')}>
                                        {t('nav.add_money') || 'Add Money'}
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        {t('nav.logout')}
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div className="flex items-center gap-2 sm:hidden">
                            <Link
                                href={route('wallet.add-money')}
                                className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-200"
                            >
                                {t('common.bdt')}
                                {Number(user?.balance ?? 0).toLocaleString('en-BD')}
                            </Link>
                            <button
                                type="button"
                                onClick={() => setShowingNavigationDropdown((open) => !open)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-white/5"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' border-t border-white/10 sm:hidden'}>
                    <div className="space-y-1 px-2 py-3">
                        {links.map((link) => (
                            <ResponsiveNavLink key={link.href} href={link.href} active={link.active}>
                                {link.label}
                            </ResponsiveNavLink>
                        ))}
                    </div>
                    <div className="border-t border-white/10 px-4 py-3">
                        <LanguageSwitcher />
                    </div>
                    <div className="border-t border-white/10 px-4 py-3">
                        <div className="mb-3 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-sm font-bold text-cyan-200">
                                {initials(user?.name)}
                            </span>
                            <div>
                                <div className="text-sm font-semibold text-white">{user.name}</div>
                                <div className="text-xs text-slate-400">{user.phone || user.email}</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <ResponsiveNavLink href={route('home')}>{t('nav.store') || 'Store'}</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('wallet.add-money')}>
                                {t('nav.add_money') || 'Add Money'}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                {t('nav.logout')}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header}

            <main className="pb-16">{children}</main>
        </div>
    );
}

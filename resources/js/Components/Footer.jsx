import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function Footer() {
    const { t } = useTrans();
    const year = new Date().getFullYear();

    const links = [
        { href: '#about', label: t('footer.about') },
        { href: '#terms', label: t('footer.terms') },
        { href: '#privacy', label: t('footer.privacy') },
        { href: '#refund', label: t('footer.refund') },
        { href: '#contact', label: t('footer.contact') },
    ];

    return (
        <footer className="mt-auto border-t border-white/5 bg-navy-950">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div>
                    <p className="text-lg font-bold text-white">{t('app.name')}</p>
                    <p className="mt-1 text-sm text-slate-400">
                        © {year} {t('app.name')}. {t('footer.rights')}
                    </p>
                </div>
                <nav className="flex flex-wrap gap-x-5 gap-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm text-slate-400 transition hover:text-cyan-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
}

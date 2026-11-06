import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function GuestLayout({ children }) {
    const { t } = useTrans();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy-950 px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.12),_transparent_45%)]" />

            <div className="relative z-10 mb-6 flex w-full max-w-md items-center justify-between">
                <Link href={route('home')} className="flex items-center gap-2">
                    <ApplicationLogo className="h-10 w-auto fill-cyan-400" />
                    <span className="text-lg font-bold text-white">{t('app.name')}</span>
                </Link>
                <LanguageSwitcher />
            </div>

            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-navy-900/80 px-6 py-6 shadow-glow-cyan backdrop-blur">
                {children}
            </div>
        </div>
    );
}

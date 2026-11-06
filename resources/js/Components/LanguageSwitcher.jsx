import { router, usePage } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function LanguageSwitcher({ className = '' }) {
    const { locale } = usePage().props;
    const { t } = useTrans();

    const switchLocale = (nextLocale) => {
        if (nextLocale === locale) {
            return;
        }

        router.post(
            route('locale.update'),
            { locale: nextLocale },
            { preserveScroll: true },
        );
    };

    return (
        <div
            className={`inline-flex items-center gap-1 rounded-lg border border-white/10 bg-navy-800/80 p-1 text-sm ${className}`}
            role="group"
            aria-label="Language"
        >
            <button
                type="button"
                onClick={() => switchLocale('bn')}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                    locale === 'bn'
                        ? 'bg-cyan-500/20 text-cyan-300 shadow-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-pressed={locale === 'bn'}
            >
                {t('lang.bn')}
            </button>
            <button
                type="button"
                onClick={() => switchLocale('en')}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                    locale === 'en'
                        ? 'bg-cyan-500/20 text-cyan-300 shadow-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-pressed={locale === 'en'}
            >
                {t('lang.en')}
            </button>
        </div>
    );
}

import { usePage } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function FloatingSupport() {
    const { supportWhatsapp } = usePage().props;
    const { t } = useTrans();

    if (!supportWhatsapp) {
        return null;
    }

    const href = `https://wa.me/${String(supportWhatsapp).replace(/\D/g, '')}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-5 end-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
            aria-label={t('support.whatsapp')}
        >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.5 3.5A11 11 0 0 0 3.1 17.3L2 22l4.8-1.1A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.8.6.6-2.7-.2-.3A9 9 0 1 1 12 20.5Zm5-6.6c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.1-.3c0-.1 0-.3-.1-.4s-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3a9.8 9.8 0 0 0 3.7 3.2c1.4.6 1.8.6 2.4.5s1.7-.7 1.9-1.4.2-1.2.1-1.3-.2-.2-.5-.3Z" />
            </svg>
            <span className="hidden sm:inline">{t('support.whatsapp')}</span>
        </a>
    );
}

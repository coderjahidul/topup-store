import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function Show({ page, title, content }) {
    const { t } = useTrans();
    const { supportWhatsapp, facebookLink } = usePage().props;

    return (
        <AppLayout title={title}>
            <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    {t('app.name')}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
                <div className="mt-8 space-y-4 whitespace-pre-line text-base leading-relaxed text-slate-300">
                    {content}
                </div>

                {page === 'contact' && (
                    <div className="mt-8 flex flex-wrap gap-3">
                        {supportWhatsapp && (
                            <a
                                href={`https://wa.me/${String(supportWhatsapp).replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
                            >
                                {t('support.whatsapp')}
                            </a>
                        )}
                        {facebookLink && (
                            <a
                                href={facebookLink}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200"
                            >
                                Facebook
                            </a>
                        )}
                    </div>
                )}

                <Link href={route('home')} className="mt-10 inline-flex text-sm text-cyan-300 hover:text-cyan-200">
                    ← {t('common.back')}
                </Link>
            </article>
        </AppLayout>
    );
}

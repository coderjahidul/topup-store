import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import useTrans from '@/hooks/useTrans';

export default function Referral({
    referralCode,
    referralCount,
    referralEarnings,
    referrals = [],
    shareUrl,
}) {
    const { t } = useTrans();
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-white">{t('nav.referral') || 'Referral'}</h2>}
        >
            <Head title={t('nav.referral') || 'Referral'} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5">
                        <p className="text-sm text-slate-400">Your referral code</p>
                        <p className="mt-2 text-3xl font-bold tracking-wider text-cyan-300">{referralCode}</p>
                        <p className="mt-3 break-all text-sm text-slate-400">{shareUrl}</p>
                        <button
                            type="button"
                            onClick={copy}
                            className="mt-4 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300"
                        >
                            {copied ? 'Copied' : 'Copy link'}
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-4">
                            <p className="text-xs text-slate-500">Referrals</p>
                            <p className="mt-1 text-2xl font-bold text-white">{referralCount}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-4">
                            <p className="text-xs text-slate-500">Earnings</p>
                            <p className="mt-1 text-2xl font-bold text-cyan-300">
                                {t('common.bdt')}
                                {Number(referralEarnings).toLocaleString('en-BD')}
                            </p>
                        </div>
                    </div>

                    <section className="rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                        <h3 className="mb-3 font-semibold text-white">Recent referrals</h3>
                        {referrals.length === 0 && (
                            <p className="text-sm text-slate-500">{t('common.empty')}</p>
                        )}
                        <ul className="space-y-2">
                            {referrals.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between rounded-xl border border-white/5 px-3 py-2 text-sm"
                                >
                                    <span className="text-slate-200">{item.name}</span>
                                    <span className="text-slate-500">
                                        {item.phone} · {item.joined_at}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

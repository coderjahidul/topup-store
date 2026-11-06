import AccountPageHeader from '@/Components/AccountPageHeader';
import EmptyState from '@/Components/EmptyState';
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

    const copy = async (value) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <AccountPageHeader
                    eyebrow={t('nav.account') || 'My Account'}
                    title={t('nav.referral') || 'Referral'}
                    description={
                        t('account.referral_hint') ||
                        'Invite friends with your link. Earnings appear in your wallet ledger.'
                    }
                    breadcrumbs={[
                        { label: t('nav.dashboard'), href: route('dashboard') },
                        { label: t('nav.referral') || 'Referral' },
                    ]}
                />
            }
        >
            <Head title={t('nav.referral') || 'Referral'} />

            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-navy-900 to-navy-950 p-6">
                    <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400/90">
                        {t('account.your_code') || 'Your referral code'}
                    </p>
                    <p className="mt-3 font-mono text-4xl font-bold tracking-[0.2em] text-white">{referralCode}</p>
                    <p className="mt-4 break-all rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                        {shareUrl}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => copy(shareUrl)}
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 text-sm font-bold text-navy-950"
                        >
                            {copied
                                ? t('account.copied') || 'Copied'
                                : t('account.copy_link') || 'Copy invite link'}
                        </button>
                        <button
                            type="button"
                            onClick={() => copy(referralCode)}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
                        >
                            {t('account.copy_code') || 'Copy code'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            {t('account.total_referrals') || 'Total referrals'}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-white">{referralCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            {t('account.referral_earnings') || 'Referral earnings'}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-cyan-300">
                            {t('common.bdt')}
                            {Number(referralEarnings || 0).toLocaleString('en-BD')}
                        </p>
                    </div>
                </div>

                <section className="rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                    <h2 className="font-semibold text-white">{t('account.recent_referrals') || 'Recent referrals'}</h2>
                    {referrals.length === 0 ? (
                        <div className="mt-4">
                            <EmptyState
                                title={t('account.no_referrals') || 'No referrals yet'}
                                description={
                                    t('account.no_referrals_hint') ||
                                    'Share your link. New signups with your code show up here.'
                                }
                            />
                        </div>
                    ) : (
                        <ul className="mt-4 divide-y divide-white/5">
                            {referrals.map((item) => (
                                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                                    <div>
                                        <p className="font-medium text-slate-100">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.phone}</p>
                                    </div>
                                    <span className="text-xs text-slate-500">{item.joined_at}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

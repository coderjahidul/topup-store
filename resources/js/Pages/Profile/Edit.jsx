import AccountPageHeader from '@/Components/AccountPageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, referralCode }) {
    const { t } = useTrans();
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <AccountPageHeader
                    eyebrow={t('nav.account') || 'My Account'}
                    title={t('nav.profile')}
                    description={
                        t('account.profile_hint') ||
                        'Manage your personal details, language preference, and password.'
                    }
                    breadcrumbs={[
                        { label: t('nav.dashboard'), href: route('dashboard') },
                        { label: t('nav.profile') },
                    ]}
                />
            }
        >
            <Head title={t('nav.profile')} />

            <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-orange-500/20 text-lg font-bold text-cyan-100 ring-1 ring-white/10">
                        {(user?.name || '?')
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((p) => p[0]?.toUpperCase() || '')
                            .join('')}
                    </div>
                    <div className="min-w-0">
                        <p className="text-lg font-semibold text-white">{user?.name}</p>
                        <p className="text-sm text-slate-400">{user?.phone || user?.email}</p>
                        {referralCode && (
                            <p className="mt-1 font-mono text-xs text-cyan-300/90">
                                {t('nav.referral')}: {referralCode}
                            </p>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="rounded-2xl border border-red-400/20 bg-navy-900/60 p-5 sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

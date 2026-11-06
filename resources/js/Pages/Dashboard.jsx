import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function Dashboard() {
    const { t } = useTrans();
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    {t('nav.dashboard')}
                </h2>
            }
        >
            <Head title={t('nav.dashboard')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900/70 p-6 shadow-glow-cyan">
                        <p className="text-slate-200">
                            {t('dashboard.welcome')}, {auth.user?.name}!
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                            {t('game.wallet_balance')}: {t('common.bdt')}
                            {Number(auth.user?.balance ?? 0).toLocaleString('en-BD')}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('wallet.add-money')}
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Add Money
                        </Link>
                        <Link
                            href={route('orders.track')}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200"
                        >
                            {t('nav.track_order')}
                        </Link>
                        <Link
                            href={`${route('home')}#games`}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200"
                        >
                            {t('home.cta_shop')}
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function Dashboard() {
    const { t } = useTrans();

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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900/70 shadow-glow-cyan">
                        <div className="p-6 text-slate-200">
                            {t('dashboard.welcome')}!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

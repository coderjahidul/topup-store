import PaginationBar from '@/Components/PaginationBar';
import AdminLayout from '@/Layouts/AdminLayout';
import useTrans from '@/hooks/useTrans';

export default function ActivityLogIndex({ activities }) {
    const { t } = useTrans();

    return (
        <AdminLayout title={t('nav.activity_log') || 'Activity log'}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">{t('nav.activity_log') || 'Activity log'}</h2>
                    <p className="mt-1 text-sm text-slate-400">{t('admin.activity_hint') || 'Audit trail of admin actions.'}</p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[900px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">{t('common.when') || 'When'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.actor') || 'Actor'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.description') || 'Description'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.subject') || 'Subject'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(activities?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No activity.'}
                                    </td>
                                </tr>
                            )}
                            {(activities?.data ?? []).map((row) => (
                                <tr key={row.id} className="hover:bg-white/[0.02]">
                                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{row.created_at}</td>
                                    <td className="px-4 py-3 text-sm">{row.causer_name ?? '—'}</td>
                                    <td className="max-w-md px-4 py-3 text-sm">{row.description}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{row.subject_type ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={activities?.links} />
            </div>
        </AdminLayout>
    );
}

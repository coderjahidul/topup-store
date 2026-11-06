import PaginationBar from '@/Components/PaginationBar';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function BannersIndex({ banners }) {
    const { t } = useTrans();

    return (
        <AdminLayout title={t('nav.banners') || 'Banners'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.banners') || 'Banners'}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.banners_hint') || 'Homepage and promo images.'}</p>
                    </div>
                    <Link
                        href={route('admin.banners.create')}
                        className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:brightness-110"
                    >
                        {t('common.create') || 'Create'}
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[960px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">{t('admin.preview') || 'Preview'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.title_bn') || 'Title (BN)'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.title_en') || 'Title (EN)'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.link') || 'Link'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.sort') || 'Sort'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Active'}</th>
                                <th className="px-4 py-3 font-medium text-end">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(banners?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No banners.'}
                                    </td>
                                </tr>
                            )}
                            {(banners?.data ?? []).map((banner) => (
                                <tr key={banner.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        {banner.image ? (
                                            <img
                                                src={banner.image}
                                                alt=""
                                                className="h-12 w-28 rounded-lg border border-white/10 object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-slate-500">—</span>
                                        )}
                                    </td>
                                    <td className="max-w-[180px] truncate px-4 py-3">{banner.title_bn}</td>
                                    <td className="max-w-[180px] truncate px-4 py-3">{banner.title_en}</td>
                                    <td className="max-w-[220px] truncate px-4 py-3 font-mono text-xs text-cyan-200/80">
                                        {banner.link || '—'}
                                    </td>
                                    <td className="px-4 py-3 tabular-nums">{banner.sort_order ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                banner.is_active
                                                    ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/25'
                                                    : 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/25'
                                            }`}
                                        >
                                            {banner.is_active ? t('common.yes') || 'Yes' : t('common.no') || 'No'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <Link
                                            href={route('admin.banners.edit', banner.id)}
                                            className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-white/5"
                                        >
                                            {t('common.edit') || 'Edit'}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={banners?.links} />
            </div>
        </AdminLayout>
    );
}

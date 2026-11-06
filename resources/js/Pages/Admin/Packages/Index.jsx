import PaginationBar from '@/Components/PaginationBar';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function PackagesIndex({ packages, games, filters }) {
    const { t } = useTrans();

    const filterForm = useForm({
        game_id: filters?.game_id ?? '',
    });

    const apply = (e) => {
        e.preventDefault();
        filterForm.get(route('admin.packages.index'), { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title={t('nav.packages') || 'Packages'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.packages') || 'Packages'}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.packages_hint') || 'Pricing, stock, and availability per game.'}</p>
                    </div>
                    <Link
                        href={route('admin.packages.create')}
                        className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:brightness-110"
                    >
                        {t('common.create') || 'Create'}
                    </Link>
                </div>

                <form
                    onSubmit={apply}
                    className="flex flex-wrap items-end gap-4 rounded-xl border border-white/10 bg-navy-900/40 p-4"
                >
                    <div>
                        <InputLabel htmlFor="game_id" value={t('nav.games') || 'Game'} />
                        <select
                            id="game_id"
                            className="mt-1 block min-w-[12rem] rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                            value={filterForm.data.game_id}
                            onChange={(e) => filterForm.setData('game_id', e.target.value)}
                        >
                            <option value="">{t('common.all') || 'All games'}</option>
                            {(games ?? []).map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <PrimaryButton type="submit" disabled={filterForm.processing}>
                        {t('common.apply') || 'Apply'}
                    </PrimaryButton>
                    <button
                        type="button"
                        onClick={() => router.get(route('admin.packages.index'))}
                        className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200 hover:bg-white/5"
                    >
                        {t('common.reset') || 'Reset'}
                    </button>
                </form>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[1000px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">ID</th>
                                <th className="px-4 py-3 font-medium">{t('nav.games') || 'Game'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.name_bn') || 'Name (BN)'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.name_en') || 'Name (EN)'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.price') || 'Price'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.stock') || 'Stock'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Active'}</th>
                                <th className="px-4 py-3 font-medium text-end">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(packages?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No packages.'}
                                    </td>
                                </tr>
                            )}
                            {(packages?.data ?? []).map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-white/[0.02]">
                                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{pkg.id}</td>
                                    <td className="px-4 py-3">{pkg.game_name ?? pkg.game?.name ?? '—'}</td>
                                    <td className="px-4 py-3 font-medium text-white">{pkg.name_bn}</td>
                                    <td className="px-4 py-3">{pkg.name_en}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {t('common.bdt')}
                                        {Number(pkg.price ?? 0).toLocaleString('en-BD')}
                                        {pkg.discount_price != null && (
                                            <span className="ms-2 text-xs text-emerald-400">
                                                ({t('admin.discount') || 'Disc.'}{' '}
                                                {Number(pkg.discount_price).toLocaleString('en-BD')})
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 tabular-nums">{pkg.stock ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                pkg.is_active
                                                    ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/25'
                                                    : 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/25'
                                            }`}
                                        >
                                            {pkg.is_active ? t('common.yes') || 'Yes' : t('common.no') || 'No'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <Link
                                            href={route('admin.packages.edit', pkg.id)}
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

                <PaginationBar links={packages?.links} />
            </div>
        </AdminLayout>
    );
}

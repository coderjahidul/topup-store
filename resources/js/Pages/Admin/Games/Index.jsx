import PaginationBar from '@/Components/PaginationBar';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function GamesIndex({ games }) {
    const { t } = useTrans();

    const toggleActive = (game) => {
        router.put(
            route('admin.games.update', game.id),
            { is_active: !Boolean(game.is_active) },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout title={t('nav.games') || 'Games'}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{t('nav.games') || 'Games'}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.games_hint') || 'Manage catalog games and UID fields.'}</p>
                    </div>
                    <Link
                        href={route('admin.games.create')}
                        className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:brightness-110"
                    >
                        {t('common.create') || 'Create'}
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[900px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">ID</th>
                                <th className="px-4 py-3 font-medium">{t('admin.name_bn') || 'Name (BN)'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.name_en') || 'Name (EN)'}</th>
                                <th className="px-4 py-3 font-medium">Slug</th>
                                <th className="px-4 py-3 font-medium">{t('admin.sort') || 'Sort'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Active'}</th>
                                <th className="px-4 py-3 font-medium text-end">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(games?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No games.'}
                                    </td>
                                </tr>
                            )}
                            {(games?.data ?? []).map((game) => (
                                <tr key={game.id} className="hover:bg-white/[0.02]">
                                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{game.id}</td>
                                    <td className="px-4 py-3 font-medium text-white">{game.name_bn}</td>
                                    <td className="px-4 py-3">{game.name_en}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-cyan-200/90">{game.slug}</td>
                                    <td className="px-4 py-3 tabular-nums">{game.sort_order ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleActive(game)}
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                game.is_active
                                                    ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30'
                                                    : 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30'
                                            }`}
                                        >
                                            {game.is_active ? t('common.active') || 'Active' : t('common.inactive') || 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <Link
                                                href={route('admin.games.edit', game.id)}
                                                className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-white/5"
                                            >
                                                {t('common.edit') || 'Edit'}
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={games?.links} />
            </div>
        </AdminLayout>
    );
}

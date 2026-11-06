import PaginationBar from '@/Components/PaginationBar';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function UsersIndex({ users, filters }) {
    const { t } = useTrans();

    const filterForm = useForm({
        search: filters?.search ?? '',
        status: filters?.status ?? '',
    });

    const apply = (e) => {
        e.preventDefault();
        filterForm.get(route('admin.users.index'), { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title={t('nav.users') || 'Users'}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">{t('nav.users') || 'Users'}</h2>
                    <p className="mt-1 text-sm text-slate-400">{t('admin.users_hint') || 'Search customers and manage access.'}</p>
                </div>

                <form
                    onSubmit={apply}
                    className="grid gap-4 rounded-xl border border-white/10 bg-navy-900/40 p-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <div className="lg:col-span-2">
                        <InputLabel htmlFor="search" value={t('common.search') || 'Search'} />
                        <TextInput
                            id="search"
                            className="mt-1 block w-full"
                            value={filterForm.data.search}
                            onChange={(e) => filterForm.setData('search', e.target.value)}
                            placeholder={t('admin.user_search_ph') || 'Phone, email, name…'}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="status" value={t('common.status') || 'Status'} />
                        <select
                            id="status"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                            value={filterForm.data.status}
                            onChange={(e) => filterForm.setData('status', e.target.value)}
                        >
                            <option value="">{t('common.all') || 'All'}</option>
                            <option value="active">{t('status.active') || 'active'}</option>
                            <option value="blocked">{t('status.blocked') || 'blocked'}</option>
                        </select>
                    </div>
                    <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-1">
                        <PrimaryButton type="submit" disabled={filterForm.processing}>
                            {t('common.apply') || 'Apply'}
                        </PrimaryButton>
                        <button
                            type="button"
                            onClick={() => router.get(route('admin.users.index'))}
                            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200 hover:bg-white/5"
                        >
                            {t('common.reset') || 'Reset'}
                        </button>
                    </div>
                </form>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[960px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">{t('admin.user') || 'User'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.balance') || 'Balance'}</th>
                                <th className="px-4 py-3 font-medium">{t('admin.roles') || 'Roles'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Status'}</th>
                                <th className="px-4 py-3 font-medium text-end">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(users?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No users.'}
                                    </td>
                                </tr>
                            )}
                            {(users?.data ?? []).map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-white">{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.phone ?? user.email ?? '—'}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-cyan-200">
                                        {t('common.bdt')}
                                        {Number(user.balance ?? 0).toLocaleString('en-BD')}
                                    </td>
                                    <td className="max-w-[200px] px-4 py-3 text-xs text-slate-400">
                                        {(user.roles ?? []).length
                                            ? user.roles.map((r) => r.name ?? r).join(', ')
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                                                user.is_blocked || user.status === 'blocked'
                                                    ? 'bg-red-500/15 text-red-300 ring-1 ring-red-400/25'
                                                    : 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/25'
                                            }`}
                                        >
                                            {user.is_blocked || user.status === 'blocked'
                                                ? t('status.blocked') || 'blocked'
                                                : t('status.active') || 'active'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <Link
                                                href={route('admin.users.show', user.id)}
                                                className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-white/5"
                                            >
                                                {t('common.view') || 'View'}
                                            </Link>
                                            {user.is_blocked || user.status === 'blocked' ? (
                                                <Link
                                                    href={route('admin.users.unblock', user.id)}
                                                    method="post"
                                                    as="button"
                                                    className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/25"
                                                >
                                                    {t('admin.unblock') || 'Unblock'}
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={route('admin.users.block', user.id)}
                                                    method="post"
                                                    as="button"
                                                    className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-200 hover:bg-amber-500/25"
                                                >
                                                    {t('admin.block') || 'Block'}
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={users?.links} />
            </div>
        </AdminLayout>
    );
}

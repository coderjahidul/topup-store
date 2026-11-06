import PaginationBar from '@/Components/PaginationBar';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function ReviewsIndex({ reviews }) {
    const { t } = useTrans();

    return (
        <AdminLayout title={t('nav.reviews') || 'Reviews'}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">{t('nav.reviews') || 'Reviews'}</h2>
                    <p className="mt-1 text-sm text-slate-400">{t('admin.reviews_hint') || 'Moderate customer feedback.'}</p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
                    <table className="min-w-[960px] w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-navy-950/50 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">{t('admin.user') || 'User'}</th>
                                <th className="px-4 py-3 font-medium">{t('nav.games') || 'Game'}</th>
                                <th className="px-4 py-3 font-medium">{t('nav.review') || 'Review'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status') || 'Status'}</th>
                                <th className="px-4 py-3 font-medium text-end">{t('common.actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {(reviews?.data ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                                        {t('common.empty') || 'No reviews.'}
                                    </td>
                                </tr>
                            )}
                            {(reviews?.data ?? []).map((review) => (
                                <tr key={review.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-white">{review.user?.name ?? review.user_name ?? '—'}</div>
                                        <div className="text-xs text-slate-500">#{review.user?.id ?? review.user_id}</div>
                                    </td>
                                    <td className="px-4 py-3">{review.game?.name ?? review.game_name ?? '—'}</td>
                                    <td className="max-w-md px-4 py-3">
                                        <p className="text-orange-300">{'★'.repeat(Number(review.rating ?? 0))}</p>
                                        {review.comment && <p className="mt-1 text-sm text-slate-300">{review.comment}</p>}
                                    </td>
                                    <td className="px-4 py-3 capitalize text-xs">
                                        <span
                                            className={`rounded-full px-2 py-0.5 font-semibold ${
                                                review.is_approved || review.status === 'approved'
                                                    ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/25'
                                                    : 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/25'
                                            }`}
                                        >
                                            {review.is_approved || review.status === 'approved'
                                                ? t('status.approved') || 'approved'
                                                : t('status.pending') || 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            {!(review.is_approved || review.status === 'approved') && (
                                                <Link
                                                    href={route('admin.reviews.approve', review.id)}
                                                    method="post"
                                                    as="button"
                                                    className="inline-flex items-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white hover:brightness-110"
                                                >
                                                    {t('admin.approve') || 'Approve'}
                                                </Link>
                                            )}
                                            <Link
                                                href={route('admin.reviews.destroy', review.id)}
                                                method="delete"
                                                as="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white hover:bg-red-500"
                                            >
                                                {t('common.delete') || 'Delete'}
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationBar links={reviews?.links} />
            </div>
        </AdminLayout>
    );
}

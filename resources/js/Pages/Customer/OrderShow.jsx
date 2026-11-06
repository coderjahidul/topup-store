import AccountPageHeader from '@/Components/AccountPageHeader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import StatusBadge from '@/Components/StatusBadge';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function OrderShow({ order }) {
    const { t } = useTrans();
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        comment: '',
    });

    const submitReview = (event) => {
        event.preventDefault();
        post(route('customer.reviews.store', order.id), {
            preserveScroll: true,
            onSuccess: () => reset('comment'),
        });
    };

    const rows = [
        [t('nav.games'), order.game],
        [t('home.packages'), order.package],
        [t('game.player_uid'), order.player_uid],
        [t('game.server'), order.server || '—'],
        [t('game.payment_method'), order.payment_method],
        [t('game.trx_id'), order.trx_id || '—'],
        [t('game.total'), `${t('common.bdt')}${Number(order.final_amount).toLocaleString('en-BD')}`],
        [t('account.ordered_at') || 'Ordered at', order.created_at],
        [t('account.completed_at') || 'Completed at', order.completed_at || '—'],
    ];

    return (
        <AuthenticatedLayout
            header={
                <AccountPageHeader
                    eyebrow={t('nav.orders')}
                    title={order.order_number}
                    description={t('account.order_detail_hint') || 'Order status, payment info, and delivery details.'}
                    breadcrumbs={[
                        { label: t('nav.dashboard'), href: route('dashboard') },
                        { label: t('nav.orders'), href: route('customer.orders.index') },
                        { label: order.order_number },
                    ]}
                    actions={
                        <button
                            type="button"
                            onClick={() => router.post(route('customer.orders.reorder', order.id))}
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 text-sm font-bold text-navy-950"
                        >
                            {t('nav.reorder') || 'Re-order'}
                        </button>
                    }
                />
            }
        >
            <Head title={order.order_number} />

            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 sm:p-6">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                        <StatusBadge status={order.status} />
                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs capitalize text-slate-400">
                            {order.payment_status}
                        </span>
                    </div>

                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                        {rows.map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-white/5 bg-navy-950/40 px-4 py-3">
                                <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
                                <dd className="mt-1 break-all font-medium text-slate-100">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {order.review && (
                    <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5">
                        <h3 className="font-semibold text-white">{t('nav.review') || 'Review'}</h3>
                        <p className="mt-2 text-orange-300">{'★'.repeat(order.review.rating)}</p>
                        {order.review.comment && (
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">{order.review.comment}</p>
                        )}
                        <p className="mt-3 text-xs text-slate-500">
                            {order.review.is_approved
                                ? t('account.review_published') || 'Published'
                                : t('account.review_pending') || 'Waiting for approval'}
                        </p>
                    </div>
                )}

                {order.can_review && (
                    <form
                        onSubmit={submitReview}
                        className="space-y-4 rounded-2xl border border-cyan-400/20 bg-navy-900/60 p-5 sm:p-6"
                    >
                        <div>
                            <h3 className="font-semibold text-white">{t('nav.write_review') || 'Write a review'}</h3>
                            <p className="mt-1 text-sm text-slate-400">
                                {t('account.review_form_hint') || 'Help other players with a quick rating.'}
                            </p>
                        </div>
                        <div>
                            <InputLabel htmlFor="rating" value={t('account.rating') || 'Rating'} />
                            <select
                                id="rating"
                                className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 text-slate-100"
                                value={data.rating}
                                onChange={(e) => setData('rating', Number(e.target.value))}
                            >
                                {[5, 4, 3, 2, 1].map((value) => (
                                    <option key={value} value={value}>
                                        {value} ★
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.rating} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="comment" value={t('account.comment') || 'Comment'} />
                            <TextInput
                                id="comment"
                                className="mt-1 block w-full"
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                placeholder={t('account.comment_ph') || 'Fast delivery…'}
                            />
                            <InputError message={errors.comment} className="mt-2" />
                        </div>
                        <PrimaryButton disabled={processing}>{t('common.save')}</PrimaryButton>
                    </form>
                )}

                <Link href={route('customer.orders.index')} className="inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-200">
                    ← {t('common.back') || 'Back'} {t('nav.orders')}
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}

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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-white">{order.order_number}</h2>}
        >
            <Head title={order.order_number} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <StatusBadge status={order.status} />
                            <button
                                type="button"
                                onClick={() => router.post(route('customer.orders.reorder', order.id))}
                                className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-sm font-medium text-cyan-300"
                            >
                                {t('nav.reorder') || 'Re-order'}
                            </button>
                        </div>

                        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                            {[
                                [t('nav.games'), order.game],
                                [t('home.packages'), order.package],
                                [t('game.player_uid'), order.player_uid],
                                [t('game.server'), order.server || '—'],
                                [t('game.payment_method'), order.payment_method],
                                [t('game.trx_id'), order.trx_id || '—'],
                                [t('game.total'), `${t('common.bdt')}${Number(order.final_amount).toLocaleString('en-BD')}`],
                                ['Created', order.created_at],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-slate-500">{label}</dt>
                                    <dd className="text-slate-200">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {order.review && (
                        <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5">
                            <h3 className="font-semibold text-white">{t('nav.review') || 'Review'}</h3>
                            <p className="mt-2 text-orange-300">{'★'.repeat(order.review.rating)}</p>
                            {order.review.comment && (
                                <p className="mt-2 text-sm text-slate-300">{order.review.comment}</p>
                            )}
                        </div>
                    )}

                    {order.can_review && (
                        <form
                            onSubmit={submitReview}
                            className="space-y-4 rounded-2xl border border-white/10 bg-navy-900/60 p-5"
                        >
                            <h3 className="font-semibold text-white">
                                {t('nav.write_review') || 'Write a review'}
                            </h3>
                            <div>
                                <InputLabel htmlFor="rating" value="Rating" />
                                <select
                                    id="rating"
                                    className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 text-slate-100"
                                    value={data.rating}
                                    onChange={(e) => setData('rating', Number(e.target.value))}
                                >
                                    {[5, 4, 3, 2, 1].map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.rating} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="comment" value="Comment" />
                                <TextInput
                                    id="comment"
                                    className="mt-1 block w-full"
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                />
                                <InputError message={errors.comment} className="mt-2" />
                            </div>
                            <PrimaryButton disabled={processing}>{t('common.save')}</PrimaryButton>
                        </form>
                    )}

                    <Link href={route('customer.orders.index')} className="inline-flex text-sm text-cyan-300">
                        ← {t('common.back')}
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

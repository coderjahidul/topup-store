import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import StatusBadge from '@/Components/StatusBadge';
import TextInput from '@/Components/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function Track({ order = null, lookupFailed = false, filters = {} }) {
    const { t } = useTrans();
    const { data, setData, post, processing, errors } = useForm({
        order_number: filters.order_number ?? '',
        phone: filters.phone ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('orders.track.lookup'), { preserveScroll: true });
    };

    return (
        <AppLayout title={t('nav.track_order')}>
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white">{t('nav.track_order')}</h1>
                <p className="mt-2 text-sm text-slate-400">
                    {t('home.faq_a2')}
                </p>

                <form
                    onSubmit={submit}
                    className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-navy-900/60 p-5"
                >
                    <div>
                        <InputLabel htmlFor="order_number" value="Order number" />
                        <TextInput
                            id="order_number"
                            className="mt-1 block w-full uppercase"
                            value={data.order_number}
                            onChange={(e) => setData('order_number', e.target.value.toUpperCase())}
                            required
                        />
                        <InputError message={errors.order_number} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="phone" value={t('game.guest_phone')} />
                        <TextInput
                            id="phone"
                            className="mt-1 block w-full"
                            value={data.phone}
                            placeholder="01XXXXXXXXX"
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>
                    <PrimaryButton disabled={processing}>{t('common.search')}</PrimaryButton>
                </form>

                {lookupFailed && (
                    <div className="mt-6 rounded-xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
                        {t('common.empty')}
                    </div>
                )}

                {order && (
                    <div className="mt-8 rounded-2xl border border-white/10 bg-navy-900/70 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-sm text-slate-400">Order</p>
                                <p className="text-xl font-bold text-white">{order.order_number}</p>
                            </div>
                            <StatusBadge
                                status={order.status}
                                label={t(`status.${order.status}`) !== `status.${order.status}`
                                    ? t(`status.${order.status}`)
                                    : order.status}
                            />
                        </div>

                        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-slate-500">{t('nav.games')}</dt>
                                <dd className="text-slate-200">{order.game}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">{t('home.packages')}</dt>
                                <dd className="text-slate-200">{order.package}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">{t('game.player_uid')}</dt>
                                <dd className="text-slate-200">{order.player_uid}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">{t('game.total')}</dt>
                                <dd className="text-cyan-300">
                                    {t('common.bdt')}
                                    {Number(order.final_amount).toLocaleString('en-BD')}
                                </dd>
                            </div>
                        </dl>

                        <ol className="mt-8 space-y-3">
                            {order.timeline.map((step) => (
                                <li key={step.key} className="flex items-center gap-3">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
                                            step.done
                                                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                                                : 'border-white/10 bg-navy-950 text-slate-500'
                                        }`}
                                    >
                                        {step.done ? '✓' : '•'}
                                    </span>
                                    <span className={step.done ? 'text-white' : 'text-slate-500'}>
                                        {t(`status.${step.key}`) !== `status.${step.key}`
                                            ? t(`status.${step.key}`)
                                            : step.key}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import EmptyState from '@/Components/EmptyState';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PackageCard from '@/Components/PackageCard';
import PaymentMethodSelector from '@/Components/PaymentMethodSelector';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';

function money(value) {
    return Number(value || 0).toLocaleString('en-BD', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

function makeToken() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `tok_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function Show({
    game,
    paymentMethods = [],
    lastPlayerUid = null,
    authUser = null,
}) {
    const { t } = useTrans();
    const { errors } = usePage().props;
    const [selectedId, setSelectedId] = useState(game.packages?.[0]?.id ?? null);

    const selectedPackage = useMemo(
        () => game.packages.find((item) => item.id === selectedId) ?? null,
        [game.packages, selectedId],
    );

    const unitPrice = selectedPackage
        ? Number(selectedPackage.discount_price ?? selectedPackage.price)
        : 0;

    const { data, setData, post, processing, reset } = useForm({
        package_id: selectedPackage?.id ?? '',
        player_uid: lastPlayerUid || '',
        server: game.requires_server ? game.servers?.[0] ?? '' : '',
        payment_method: paymentMethods[0]?.code ?? 'bkash',
        coupon_code: '',
        guest_name: authUser?.name ?? '',
        guest_phone: authUser?.phone ?? '',
        guest_email: authUser?.email ?? '',
        sender_number: '',
        trx_id: '',
        idempotency_token: makeToken(),
    });

    const selectPackage = (packageItem) => {
        setSelectedId(packageItem.id);
        setData('package_id', packageItem.id);
    };

    const isWallet = data.payment_method === 'wallet';

    const submit = (event) => {
        event.preventDefault();

        post(route('games.checkout-preview', game.slug), {
            preserveScroll: true,
            onSuccess: () => {
                setData('idempotency_token', makeToken());
                reset('trx_id');
            },
        });
    };

    return (
        <AppLayout title={game.name}>
            <div className="relative overflow-hidden border-b border-white/5">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_35%)]" />
                <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        {t('nav.games')}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{game.name}</h1>
                    {game.description && (
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                            {game.description}
                        </p>
                    )}
                </div>
            </div>

            <form onSubmit={submit} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-300">
                        {t('game.step_package')}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1">{t('game.step_uid')}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1">{t('game.step_pay')}</span>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
                    <div className="space-y-8">
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-white">
                                {t('game.select_package')}
                            </h2>
                            {game.packages?.length ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {game.packages.map((packageItem) => (
                                        <PackageCard
                                            key={packageItem.id}
                                            packageItem={packageItem}
                                            selected={selectedId === packageItem.id}
                                            onSelect={selectPackage}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title={t('game.no_packages')} />
                            )}
                            <InputError message={errors.package_id} className="mt-2" />
                        </section>

                        <section className="space-y-4 rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                            <h2 className="text-xl font-bold text-white">{t('game.step_uid')}</h2>

                            <div>
                                <InputLabel htmlFor="player_uid" value={game.uid_label || t('game.player_uid')} />
                                <TextInput
                                    id="player_uid"
                                    className="mt-1 block w-full"
                                    value={data.player_uid}
                                    onChange={(e) => setData('player_uid', e.target.value)}
                                    required
                                />
                                <InputError message={errors.player_uid} className="mt-2" />
                            </div>

                            {game.requires_server && (
                                <div>
                                    <InputLabel htmlFor="server" value={t('game.server')} />
                                    <select
                                        id="server"
                                        className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
                                        value={data.server}
                                        onChange={(e) => setData('server', e.target.value)}
                                        required
                                    >
                                        {game.servers.map((server) => (
                                            <option key={server} value={server}>
                                                {server}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.server} className="mt-2" />
                                </div>
                            )}

                            {!authUser && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="guest_name" value={t('game.guest_name')} />
                                        <TextInput
                                            id="guest_name"
                                            className="mt-1 block w-full"
                                            value={data.guest_name}
                                            onChange={(e) => setData('guest_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.guest_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="guest_phone" value={t('game.guest_phone')} />
                                        <TextInput
                                            id="guest_phone"
                                            className="mt-1 block w-full"
                                            value={data.guest_phone}
                                            placeholder="01XXXXXXXXX"
                                            onChange={(e) => setData('guest_phone', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.guest_phone} className="mt-2" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="guest_email" value={t('game.guest_email')} />
                                        <TextInput
                                            id="guest_email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.guest_email}
                                            onChange={(e) => setData('guest_email', e.target.value)}
                                        />
                                        <InputError message={errors.guest_email} className="mt-2" />
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="space-y-4 rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                            <h2 className="text-xl font-bold text-white">{t('game.payment_method')}</h2>
                            <PaymentMethodSelector
                                methods={paymentMethods}
                                value={data.payment_method}
                                onChange={(code) => setData('payment_method', code)}
                            />
                            <InputError message={errors.payment_method} className="mt-2" />

                            {!isWallet && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="sender_number" value={t('game.sender_number')} />
                                        <TextInput
                                            id="sender_number"
                                            className="mt-1 block w-full"
                                            value={data.sender_number}
                                            placeholder="01XXXXXXXXX"
                                            onChange={(e) => setData('sender_number', e.target.value)}
                                        />
                                        <InputError message={errors.sender_number} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="trx_id" value={t('game.trx_id')} />
                                        <TextInput
                                            id="trx_id"
                                            className="mt-1 block w-full uppercase"
                                            value={data.trx_id}
                                            onChange={(e) => setData('trx_id', e.target.value.toUpperCase())}
                                        />
                                        <InputError message={errors.trx_id} className="mt-2" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="coupon_code" value={t('game.coupon')} />
                                <TextInput
                                    id="coupon_code"
                                    className="mt-1 block w-full uppercase"
                                    value={data.coupon_code}
                                    onChange={(e) => setData('coupon_code', e.target.value.toUpperCase())}
                                />
                                <InputError message={errors.coupon_code} className="mt-2" />
                            </div>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-2xl border border-white/10 bg-navy-900/80 p-5 shadow-glow-violet">
                            <h2 className="text-lg font-bold text-white">{t('game.order_summary')}</h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-3">
                                    <dt className="text-slate-400">{t('nav.games')}</dt>
                                    <dd className="text-right text-slate-200">{game.name}</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <dt className="text-slate-400">{t('home.packages')}</dt>
                                    <dd className="text-right text-slate-200">
                                        {selectedPackage?.name ?? '—'}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <dt className="text-slate-400">{t('game.price')}</dt>
                                    <dd className="text-right text-slate-200">
                                        {t('common.bdt')}
                                        {money(selectedPackage?.price)}
                                    </dd>
                                </div>
                                {selectedPackage?.discount_price && (
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-slate-400">{t('game.discount')}</dt>
                                        <dd className="text-right text-orange-300">
                                            -{t('common.bdt')}
                                            {money(
                                                Number(selectedPackage.price) -
                                                    Number(selectedPackage.discount_price),
                                            )}
                                        </dd>
                                    </div>
                                )}
                                <div className="flex justify-between gap-3 border-t border-white/10 pt-3 text-base font-semibold">
                                    <dt className="text-white">{t('game.total')}</dt>
                                    <dd className="text-cyan-300">
                                        {t('common.bdt')}
                                        {money(unitPrice)}
                                    </dd>
                                </div>
                            </dl>

                            <PrimaryButton
                                className="mt-6 w-full justify-center py-3"
                                disabled={processing || !selectedPackage}
                            >
                                {t('game.buy_now')}
                            </PrimaryButton>
                        </div>
                    </aside>
                </div>
            </form>
        </AppLayout>
    );
}

import AccountPageHeader from '@/Components/AccountPageHeader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PaymentMethodSelector from '@/Components/PaymentMethodSelector';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import useTrans from '@/hooks/useTrans';

export default function AddMoney({ paymentMethods = [], balance }) {
    const { t } = useTrans();
    const methods = useMemo(
        () =>
            paymentMethods.map((method) => ({
                ...method,
                code: String(method.id),
            })),
        [paymentMethods],
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_method_id: paymentMethods[0]?.id ?? '',
        amount: '',
        sender_number: '',
        trx_id: '',
    });

    const selectedCode = String(data.payment_method_id || '');

    const submit = (event) => {
        event.preventDefault();
        post(route('wallet.add-money.store'), {
            preserveScroll: true,
            onSuccess: () => reset('amount', 'sender_number', 'trx_id'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <AccountPageHeader
                    eyebrow={t('nav.transactions') || 'Wallet'}
                    title={t('nav.add_money') || 'Add Money'}
                    description={
                        t('account.add_money_hint') ||
                        'Send money to our merchant number, then submit amount and TrxID for approval.'
                    }
                    breadcrumbs={[
                        { label: t('nav.dashboard'), href: route('dashboard') },
                        { label: t('nav.transactions') || 'Wallet', href: route('customer.transactions') },
                        { label: t('nav.add_money') || 'Add Money' },
                    ]}
                />
            }
        >
            <Head title={t('nav.add_money') || 'Add Money'} />

            <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-cyan-400/20 bg-navy-900/60 p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{t('game.wallet_balance')}</p>
                    <p className="mt-1 text-3xl font-bold text-cyan-300">
                        {t('common.bdt')}
                        {Number(balance || 0).toLocaleString('en-BD')}
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-2xl border border-white/10 bg-navy-900/60 p-5 sm:p-6"
                >
                    <div>
                        <InputLabel value={t('game.payment_method')} />
                        <div className="mt-2">
                            <PaymentMethodSelector
                                methods={methods}
                                value={selectedCode}
                                onChange={(code) => setData('payment_method_id', Number(code))}
                            />
                        </div>
                        <InputError message={errors.payment_method_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="amount" value={t('account.amount') || 'Amount'} />
                        <TextInput
                            id="amount"
                            type="number"
                            min="10"
                            step="1"
                            className="mt-1 block w-full"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            required
                        />
                        <InputError message={errors.amount} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="sender_number" value={t('game.sender_number')} />
                        <TextInput
                            id="sender_number"
                            className="mt-1 block w-full"
                            value={data.sender_number}
                            placeholder="01XXXXXXXXX"
                            onChange={(e) => setData('sender_number', e.target.value)}
                            required
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
                            required
                        />
                        <InputError message={errors.trx_id} className="mt-2" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <PrimaryButton disabled={processing}>{t('common.continue')}</PrimaryButton>
                        <Link href={route('customer.transactions')} className="text-sm text-cyan-300">
                            {t('account.view_ledger') || 'View ledger'}
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PaymentMethodSelector from '@/Components/PaymentMethodSelector';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
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
        <AppLayout title={t('nav.wallet')}>
            <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white">Add Money</h1>
                <p className="mt-2 text-sm text-slate-400">
                    {t('game.wallet_balance')}: {t('common.bdt')}
                    {Number(balance).toLocaleString('en-BD')}
                </p>

                <form
                    onSubmit={submit}
                    className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-navy-900/60 p-5"
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
                        <InputLabel htmlFor="amount" value="Amount" />
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

                    <PrimaryButton disabled={processing}>{t('common.continue')}</PrimaryButton>
                </form>
            </div>
        </AppLayout>
    );
}

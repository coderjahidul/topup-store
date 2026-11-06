import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function PaymentMethodForm({ payment_method: paymentMethodSnake, paymentMethod, mode }) {
    const { t } = useTrans();
    const isEdit = mode === 'edit';
    const row = paymentMethod ?? paymentMethodSnake;

    const form = useForm({
        name: row?.name ?? '',
        code: row?.code ?? '',
        account_number: row?.account_number ?? '',
        account_type: row?.account_type ?? 'personal',
        instruction_bn: row?.instruction_bn ?? '',
        instruction_en: row?.instruction_en ?? '',
        logo: row?.logo ?? '',
        min_amount: row?.min_amount ?? '',
        max_amount: row?.max_amount ?? '',
        charge_percent: row?.charge_percent ?? '',
        is_active: row?.is_active ?? true,
        sort_order: row?.sort_order ?? 0,
    });

    form.transform((fd) => ({
        ...fd,
        min_amount: fd.min_amount === '' ? null : Number(fd.min_amount),
        max_amount: fd.max_amount === '' ? null : Number(fd.max_amount),
        charge_percent: fd.charge_percent === '' ? null : Number(fd.charge_percent),
        sort_order: Number(fd.sort_order) || 0,
        is_active: Boolean(fd.is_active),
    }));

    const { data, setData, post, put, processing, errors } = form;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.payment-methods.update', row.id));
        } else {
            post(route('admin.payment-methods.store'));
        }
    };

    const title = isEdit ? t('admin.edit_payment_method') || 'Edit payment method' : t('admin.create_payment_method') || 'Create payment method';

    return (
        <AdminLayout title={title}>
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.payment_method_form_hint') || 'Shown on checkout and wallet top-up.'}</p>
                    </div>
                    <Link href={route('admin.payment-methods.index')} className="text-sm text-cyan-300 hover:text-cyan-200">
                        ← {t('common.back') || 'Back'}
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="name" value={t('admin.name') || 'Name'} />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="code" value={t('admin.code') || 'Code'} />
                            <TextInput
                                id="code"
                                className="mt-1 block w-full font-mono text-sm"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                            />
                            <InputError message={errors.code} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="account_number" value={t('admin.account_number') || 'Account number'} />
                            <TextInput
                                id="account_number"
                                className="mt-1 block w-full font-mono text-sm"
                                value={data.account_number}
                                onChange={(e) => setData('account_number', e.target.value)}
                            />
                            <InputError message={errors.account_number} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="account_type" value={t('admin.account_type') || 'Account type'} />
                            <select
                                id="account_type"
                                className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                                value={data.account_type}
                                onChange={(e) => setData('account_type', e.target.value)}
                            >
                                <option value="personal">{t('admin.personal') || 'Personal'}</option>
                                <option value="merchant">{t('admin.merchant') || 'Merchant'}</option>
                                <option value="agent">{t('admin.agent') || 'Agent'}</option>
                            </select>
                            <InputError message={errors.account_type} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="instruction_bn" value={t('admin.instruction_bn') || 'Instruction (BN)'} />
                        <textarea
                            id="instruction_bn"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:ring-cyan-400"
                            rows={3}
                            value={data.instruction_bn}
                            onChange={(e) => setData('instruction_bn', e.target.value)}
                        />
                        <InputError message={errors.instruction_bn} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="instruction_en" value={t('admin.instruction_en') || 'Instruction (EN)'} />
                        <textarea
                            id="instruction_en"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:ring-cyan-400"
                            rows={3}
                            value={data.instruction_en}
                            onChange={(e) => setData('instruction_en', e.target.value)}
                        />
                        <InputError message={errors.instruction_en} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="logo" value={t('admin.logo_url') || 'Logo URL'} />
                        <TextInput
                            id="logo"
                            className="mt-1 block w-full font-mono text-xs"
                            value={data.logo}
                            onChange={(e) => setData('logo', e.target.value)}
                            placeholder="https://"
                        />
                        <InputError message={errors.logo} className="mt-2" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <InputLabel htmlFor="min_amount" value={t('admin.min_amount') || 'Min amount'} />
                            <TextInput
                                id="min_amount"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.min_amount}
                                onChange={(e) => setData('min_amount', e.target.value)}
                            />
                            <InputError message={errors.min_amount} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="max_amount" value={t('admin.max_amount') || 'Max amount'} />
                            <TextInput
                                id="max_amount"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.max_amount}
                                onChange={(e) => setData('max_amount', e.target.value)}
                            />
                            <InputError message={errors.max_amount} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="charge_percent" value={t('admin.charge_percent') || 'Charge %'} />
                            <TextInput
                                id="charge_percent"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.charge_percent}
                                onChange={(e) => setData('charge_percent', e.target.value)}
                            />
                            <InputError message={errors.charge_percent} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="min-w-[8rem] flex-1">
                            <InputLabel htmlFor="sort_order" value={t('admin.sort_order') || 'Sort order'} />
                            <TextInput
                                id="sort_order"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                            />
                            <InputError message={errors.sort_order} className="mt-2" />
                        </div>
                        <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                            <input
                                type="checkbox"
                                className="rounded border-white/20 bg-navy-950 text-cyan-500 focus:ring-cyan-400"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            {t('common.active') || 'Active'}
                        </label>
                    </div>

                    <PrimaryButton disabled={processing}>{t('common.save') || 'Save'}</PrimaryButton>
                </form>
            </div>
        </AdminLayout>
    );
}

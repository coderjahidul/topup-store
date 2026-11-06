import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function CouponForm({ coupon, games, mode }) {
    const { t } = useTrans();
    const isEdit = mode === 'edit';

    const form = useForm({
        code: coupon?.code ?? '',
        type: coupon?.type ?? 'percent',
        value: coupon?.value ?? '',
        min_order_amount: coupon?.min_order_amount ?? '',
        max_discount: coupon?.max_discount ?? '',
        usage_limit: coupon?.usage_limit ?? '',
        per_user_limit: coupon?.per_user_limit ?? '',
        starts_at: coupon?.starts_at?.slice?.(0, 16) ?? coupon?.starts_at ?? '',
        expires_at: coupon?.expires_at?.slice?.(0, 16) ?? coupon?.expires_at ?? '',
        applicable_game_id: coupon?.applicable_game_id ?? '',
        first_order_only: Boolean(coupon?.first_order_only),
        is_active: coupon?.is_active ?? true,
    });

    form.transform((fd) => ({
        ...fd,
        value: fd.value === '' ? null : Number(fd.value),
        min_order_amount: fd.min_order_amount === '' ? null : Number(fd.min_order_amount),
        max_discount: fd.max_discount === '' ? null : Number(fd.max_discount),
        usage_limit: fd.usage_limit === '' ? null : Number(fd.usage_limit),
        per_user_limit: fd.per_user_limit === '' ? null : Number(fd.per_user_limit),
        applicable_game_id: fd.applicable_game_id === '' ? null : Number(fd.applicable_game_id),
        first_order_only: Boolean(fd.first_order_only),
        starts_at: fd.starts_at || null,
        expires_at: fd.expires_at || null,
    }));

    const { data, setData, post, put, processing, errors } = form;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.coupons.update', coupon.id));
        } else {
            post(route('admin.coupons.store'));
        }
    };

    const title = isEdit ? t('admin.edit_coupon') || 'Edit coupon' : t('admin.create_coupon') || 'Create coupon';

    return (
        <AdminLayout title={title}>
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.coupon_form_hint') || 'Configure discount caps and eligibility.'}</p>
                    </div>
                    <Link href={route('admin.coupons.index')} className="text-sm text-cyan-300 hover:text-cyan-200">
                        ← {t('common.back') || 'Back'}
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="code" value={t('admin.code') || 'Code'} />
                            <TextInput
                                id="code"
                                className="mt-1 block w-full font-mono uppercase"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                            />
                            <InputError message={errors.code} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="type" value={t('admin.type') || 'Type'} />
                            <select
                                id="type"
                                className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                <option value="percent">{t('admin.percent') || 'Percent'}</option>
                                <option value="fixed">{t('admin.fixed') || 'Fixed (BDT)'}</option>
                            </select>
                            <InputError message={errors.type} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="value" value={t('admin.value') || 'Value'} />
                        <TextInput
                            id="value"
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                        />
                        <InputError message={errors.value} className="mt-2" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="min_order_amount" value={t('admin.min_order') || 'Min order amount'} />
                            <TextInput
                                id="min_order_amount"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.min_order_amount}
                                onChange={(e) => setData('min_order_amount', e.target.value)}
                            />
                            <InputError message={errors.min_order_amount} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="max_discount" value={t('admin.max_discount') || 'Max discount'} />
                            <TextInput
                                id="max_discount"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.max_discount}
                                onChange={(e) => setData('max_discount', e.target.value)}
                            />
                            <InputError message={errors.max_discount} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="usage_limit" value={t('admin.usage_limit') || 'Usage limit'} />
                            <TextInput
                                id="usage_limit"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.usage_limit}
                                onChange={(e) => setData('usage_limit', e.target.value)}
                            />
                            <InputError message={errors.usage_limit} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="per_user_limit" value={t('admin.per_user_limit') || 'Per-user limit'} />
                            <TextInput
                                id="per_user_limit"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.per_user_limit}
                                onChange={(e) => setData('per_user_limit', e.target.value)}
                            />
                            <InputError message={errors.per_user_limit} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="starts_at" value={t('admin.starts_at') || 'Starts at'} />
                            <TextInput
                                id="starts_at"
                                type="datetime-local"
                                className="mt-1 block w-full"
                                value={data.starts_at}
                                onChange={(e) => setData('starts_at', e.target.value)}
                            />
                            <InputError message={errors.starts_at} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="expires_at" value={t('admin.expires_at') || 'Expires at'} />
                            <TextInput
                                id="expires_at"
                                type="datetime-local"
                                className="mt-1 block w-full"
                                value={data.expires_at}
                                onChange={(e) => setData('expires_at', e.target.value)}
                            />
                            <InputError message={errors.expires_at} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="applicable_game_id" value={t('admin.applicable_game') || 'Applicable game (optional)'} />
                        <select
                            id="applicable_game_id"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                            value={data.applicable_game_id}
                            onChange={(e) => setData('applicable_game_id', e.target.value)}
                        >
                            <option value="">{t('admin.all_games') || 'All games'}</option>
                            {(games ?? []).map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.applicable_game_id} className="mt-2" />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                            <input
                                type="checkbox"
                                className="rounded border-white/20 bg-navy-950 text-cyan-500 focus:ring-cyan-400"
                                checked={data.first_order_only}
                                onChange={(e) => setData('first_order_only', e.target.checked)}
                            />
                            {t('admin.first_order_only') || 'First order only'}
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
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

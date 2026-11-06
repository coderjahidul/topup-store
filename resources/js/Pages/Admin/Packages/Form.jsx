import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function PackageForm({ package: pkg, games, mode }) {
    const { t } = useTrans();
    const isEdit = mode === 'edit';

    const form = useForm({
        game_id: pkg?.game_id ?? '',
        name_bn: pkg?.name_bn ?? '',
        name_en: pkg?.name_en ?? '',
        price: pkg?.price ?? '',
        discount_price: pkg?.discount_price ?? '',
        reseller_price: pkg?.reseller_price ?? '',
        cost_price: pkg?.cost_price ?? '',
        stock: pkg?.stock ?? '',
        supplier_code: pkg?.supplier_code ?? '',
        sort_order: pkg?.sort_order ?? 0,
        is_active: pkg?.is_active ?? true,
    });

    form.transform((formData) => ({
        ...formData,
        game_id: formData.game_id === '' ? null : Number(formData.game_id),
        price: formData.price === '' ? null : Number(formData.price),
        discount_price: formData.discount_price === '' ? null : Number(formData.discount_price),
        reseller_price: formData.reseller_price === '' ? null : Number(formData.reseller_price),
        cost_price: formData.cost_price === '' ? null : Number(formData.cost_price),
        stock: formData.stock === '' ? null : Number(formData.stock),
        sort_order: Number(formData.sort_order) || 0,
    }));

    const { data, setData, post, put, processing, errors } = form;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.packages.update', pkg.id));
        } else {
            post(route('admin.packages.store'));
        }
    };

    const title = isEdit ? t('admin.edit_package') || 'Edit package' : t('admin.create_package') || 'Create package';

    return (
        <AdminLayout title={title}>
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.package_form_hint') || 'Link to a game and set commercial terms.'}</p>
                    </div>
                    <Link href={route('admin.packages.index')} className="text-sm text-cyan-300 hover:text-cyan-200">
                        ← {t('common.back') || 'Back'}
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <div>
                        <InputLabel htmlFor="game_id" value={t('nav.games') || 'Game'} />
                        <select
                            id="game_id"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100"
                            value={data.game_id}
                            onChange={(e) => setData('game_id', e.target.value)}
                            required
                        >
                            <option value="">{t('admin.select_game') || 'Select game'}</option>
                            {(games ?? []).map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.game_id} className="mt-2" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="name_bn" value={t('admin.name_bn') || 'Name (BN)'} />
                            <TextInput
                                id="name_bn"
                                className="mt-1 block w-full"
                                value={data.name_bn}
                                onChange={(e) => setData('name_bn', e.target.value)}
                            />
                            <InputError message={errors.name_bn} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="name_en" value={t('admin.name_en') || 'Name (EN)'} />
                            <TextInput
                                id="name_en"
                                className="mt-1 block w-full"
                                value={data.name_en}
                                onChange={(e) => setData('name_en', e.target.value)}
                            />
                            <InputError message={errors.name_en} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="price" value={t('admin.price') || 'Price'} />
                            <TextInput
                                id="price"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="discount_price" value={t('admin.discount_price') || 'Discount price'} />
                            <TextInput
                                id="discount_price"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.discount_price}
                                onChange={(e) => setData('discount_price', e.target.value)}
                            />
                            <InputError message={errors.discount_price} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="reseller_price" value={t('admin.reseller_price') || 'Reseller price'} />
                            <TextInput
                                id="reseller_price"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.reseller_price}
                                onChange={(e) => setData('reseller_price', e.target.value)}
                            />
                            <InputError message={errors.reseller_price} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="cost_price" value={t('admin.cost_price') || 'Cost price'} />
                            <TextInput
                                id="cost_price"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.cost_price}
                                onChange={(e) => setData('cost_price', e.target.value)}
                            />
                            <InputError message={errors.cost_price} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="stock" value={t('admin.stock') || 'Stock'} />
                            <TextInput
                                id="stock"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                            />
                            <InputError message={errors.stock} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="supplier_code" value={t('admin.supplier_code') || 'Supplier code'} />
                            <TextInput
                                id="supplier_code"
                                className="mt-1 block w-full font-mono text-sm"
                                value={data.supplier_code}
                                onChange={(e) => setData('supplier_code', e.target.value)}
                            />
                            <InputError message={errors.supplier_code} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[8rem]">
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

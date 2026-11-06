import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function BannerForm({ banner, mode }) {
    const { t } = useTrans();
    const isEdit = mode === 'edit';

    const form = useForm({
        title_bn: banner?.title_bn ?? '',
        title_en: banner?.title_en ?? '',
        image: banner?.image ?? '',
        link: banner?.link ?? '',
        sort_order: banner?.sort_order ?? 0,
        is_active: banner?.is_active ?? true,
    });

    form.transform((fd) => ({
        ...fd,
        sort_order: Number(fd.sort_order) || 0,
    }));

    const { data, setData, post, put, processing, errors } = form;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.banners.update', banner.id));
        } else {
            post(route('admin.banners.store'));
        }
    };

    const title = isEdit ? t('admin.edit_banner') || 'Edit banner' : t('admin.create_banner') || 'Create banner';

    return (
        <AdminLayout title={title}>
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.banner_form_hint') || 'Paste an image URL and optional outbound link.'}</p>
                    </div>
                    <Link href={route('admin.banners.index')} className="text-sm text-cyan-300 hover:text-cyan-200">
                        ← {t('common.back') || 'Back'}
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="title_bn" value={t('admin.title_bn') || 'Title (BN)'} />
                            <TextInput
                                id="title_bn"
                                className="mt-1 block w-full"
                                value={data.title_bn}
                                onChange={(e) => setData('title_bn', e.target.value)}
                            />
                            <InputError message={errors.title_bn} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="title_en" value={t('admin.title_en') || 'Title (EN)'} />
                            <TextInput
                                id="title_en"
                                className="mt-1 block w-full"
                                value={data.title_en}
                                onChange={(e) => setData('title_en', e.target.value)}
                            />
                            <InputError message={errors.title_en} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="image" value={t('admin.image_url') || 'Image URL'} />
                        <TextInput
                            id="image"
                            className="mt-1 block w-full font-mono text-xs"
                            value={data.image}
                            onChange={(e) => setData('image', e.target.value)}
                            placeholder="https://"
                        />
                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="link" value={t('admin.link') || 'Link'} />
                        <TextInput
                            id="link"
                            className="mt-1 block w-full font-mono text-xs"
                            value={data.link}
                            onChange={(e) => setData('link', e.target.value)}
                            placeholder="https://"
                        />
                        <InputError message={errors.link} className="mt-2" />
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

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function GameForm({ game, mode }) {
    const { t } = useTrans();
    const isEdit = mode === 'edit';

    const form = useForm({
        name_bn: game?.name_bn ?? '',
        name_en: game?.name_en ?? '',
        slug: game?.slug ?? '',
        uid_label_bn: game?.uid_label_bn ?? '',
        uid_label_en: game?.uid_label_en ?? '',
        description_bn: game?.description_bn ?? '',
        description_en: game?.description_en ?? '',
        requires_server: Boolean(game?.requires_server),
        servers: Array.isArray(game?.servers) ? game.servers.join(', ') : game?.servers ?? '',
        sort_order: game?.sort_order ?? 0,
        is_active: game?.is_active ?? true,
    });

    form.transform((formData) => ({
        ...formData,
        requires_server: Boolean(formData.requires_server),
        sort_order: Number(formData.sort_order) || 0,
    }));

    const { data, setData, post, put, processing, errors } = form;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.games.update', game.id));
        } else {
            post(route('admin.games.store'));
        }
    };

    const title = isEdit ? t('admin.edit_game') || 'Edit game' : t('admin.create_game') || 'Create game';

    return (
        <AdminLayout title={title}>
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.game_form_hint') || 'Names, UID labels, and optional server list.'}</p>
                    </div>
                    <Link href={route('admin.games.index')} className="text-sm text-cyan-300 hover:text-cyan-200">
                        ← {t('common.back') || 'Back'}
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-navy-900/40 p-5">
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

                    <div>
                        <InputLabel htmlFor="slug" value="Slug" />
                        <TextInput
                            id="slug"
                            className="mt-1 block w-full font-mono text-sm"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                        />
                        <InputError message={errors.slug} className="mt-2" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="uid_label_bn" value={t('admin.uid_label_bn') || 'UID label (BN)'} />
                            <TextInput
                                id="uid_label_bn"
                                className="mt-1 block w-full"
                                value={data.uid_label_bn}
                                onChange={(e) => setData('uid_label_bn', e.target.value)}
                            />
                            <InputError message={errors.uid_label_bn} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="uid_label_en" value={t('admin.uid_label_en') || 'UID label (EN)'} />
                            <TextInput
                                id="uid_label_en"
                                className="mt-1 block w-full"
                                value={data.uid_label_en}
                                onChange={(e) => setData('uid_label_en', e.target.value)}
                            />
                            <InputError message={errors.uid_label_en} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="description_bn" value={t('admin.description_bn') || 'Description (BN)'} />
                        <textarea
                            id="description_bn"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                            rows={3}
                            value={data.description_bn}
                            onChange={(e) => setData('description_bn', e.target.value)}
                        />
                        <InputError message={errors.description_bn} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="description_en" value={t('admin.description_en') || 'Description (EN)'} />
                        <textarea
                            id="description_en"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                            rows={3}
                            value={data.description_en}
                            onChange={(e) => setData('description_en', e.target.value)}
                        />
                        <InputError message={errors.description_en} className="mt-2" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-navy-950/40 p-3">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                            <input
                                type="checkbox"
                                className="rounded border-white/20 bg-navy-950 text-cyan-500 focus:ring-cyan-400"
                                checked={data.requires_server}
                                onChange={(e) => setData('requires_server', e.target.checked)}
                            />
                            {t('admin.requires_server') || 'Requires server'}
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

                    <div>
                        <InputLabel
                            htmlFor="servers"
                            value={t('admin.servers_csv') || 'Servers (comma-separated)'}
                        />
                        <TextInput
                            id="servers"
                            className="mt-1 block w-full"
                            value={data.servers}
                            onChange={(e) => setData('servers', e.target.value)}
                            placeholder="Asia, Europe, ..."
                        />
                        <InputError message={errors.servers} className="mt-2" />
                    </div>

                    <div>
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

                    <PrimaryButton disabled={processing}>{t('common.save') || 'Save'}</PrimaryButton>
                </form>
            </div>
        </AdminLayout>
    );
}

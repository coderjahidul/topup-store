import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function NoticeForm({ notice, mode }) {
    const { t } = useTrans();
    const isEdit = mode === 'edit';

    const { data, setData, post, put, processing, errors } = useForm({
        message_bn: notice?.message_bn ?? '',
        message_en: notice?.message_en ?? '',
        is_active: notice?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.notices.update', notice.id));
        } else {
            post(route('admin.notices.store'));
        }
    };

    const title = isEdit ? t('admin.edit_notice') || 'Edit notice' : t('admin.create_notice') || 'Create notice';

    return (
        <AdminLayout title={title}>
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-slate-400">{t('admin.notice_form_hint') || 'Short messages for customers.'}</p>
                    </div>
                    <Link href={route('admin.notices.index')} className="text-sm text-cyan-300 hover:text-cyan-200">
                        ← {t('common.back') || 'Back'}
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <div>
                        <InputLabel htmlFor="message_bn" value={t('admin.message_bn') || 'Message (BN)'} />
                        <textarea
                            id="message_bn"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                            rows={3}
                            value={data.message_bn}
                            onChange={(e) => setData('message_bn', e.target.value)}
                        />
                        <InputError message={errors.message_bn} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="message_en" value={t('admin.message_en') || 'Message (EN)'} />
                        <textarea
                            id="message_en"
                            className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                            rows={3}
                            value={data.message_en}
                            onChange={(e) => setData('message_en', e.target.value)}
                        />
                        <InputError message={errors.message_en} className="mt-2" />
                    </div>

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                        <input
                            type="checkbox"
                            className="rounded border-white/20 bg-navy-950 text-cyan-500 focus:ring-cyan-400"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        {t('common.active') || 'Active'}
                    </label>

                    <PrimaryButton disabled={processing}>{t('common.save') || 'Save'}</PrimaryButton>
                </form>
            </div>
        </AdminLayout>
    );
}

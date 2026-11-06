import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function SettingsEdit({ settings }) {
    const { t } = useTrans();

    const { data, setData, put, processing, errors } = useForm({
        site_name: settings?.site_name ?? '',
        support_whatsapp: settings?.support_whatsapp ?? '',
        facebook_link: settings?.facebook_link ?? '',
        maintenance_mode: Boolean(settings?.maintenance_mode),
        min_order_amount: settings?.min_order_amount ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.settings.update'));
    };

    return (
        <AdminLayout title={t('nav.settings') || 'Settings'}>
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">{t('nav.settings') || 'Site settings'}</h2>
                    <p className="mt-1 text-sm text-slate-400">{t('admin.settings_hint') || 'Global storefront configuration.'}</p>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <div>
                        <InputLabel htmlFor="site_name" value={t('admin.site_name') || 'Site name'} />
                        <TextInput
                            id="site_name"
                            className="mt-1 block w-full"
                            value={data.site_name}
                            onChange={(e) => setData('site_name', e.target.value)}
                        />
                        <InputError message={errors.site_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="support_whatsapp" value={t('admin.support_whatsapp') || 'Support WhatsApp'} />
                        <TextInput
                            id="support_whatsapp"
                            className="mt-1 block w-full"
                            value={data.support_whatsapp}
                            onChange={(e) => setData('support_whatsapp', e.target.value)}
                            placeholder="+8801..."
                        />
                        <InputError message={errors.support_whatsapp} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="facebook_link" value={t('admin.facebook_link') || 'Facebook link'} />
                        <TextInput
                            id="facebook_link"
                            className="mt-1 block w-full font-mono text-xs"
                            value={data.facebook_link}
                            onChange={(e) => setData('facebook_link', e.target.value)}
                            placeholder="https://facebook.com/..."
                        />
                        <InputError message={errors.facebook_link} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="min_order_amount" value={t('admin.min_order_amount') || 'Minimum order amount'} />
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

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-200">
                        <input
                            type="checkbox"
                            className="rounded border-white/20 bg-navy-950 text-amber-500 focus:ring-amber-400"
                            checked={data.maintenance_mode}
                            onChange={(e) => setData('maintenance_mode', e.target.checked)}
                        />
                        {t('admin.maintenance_mode') || 'Maintenance mode'}
                    </label>
                    <InputError message={errors.maintenance_mode} className="mt-2" />

                    <PrimaryButton disabled={processing}>{t('common.save') || 'Save'}</PrimaryButton>
                </form>
            </div>
        </AdminLayout>
    );
}

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function SupplierForm({ supplier, drivers = [], mode }) {
    const { t } = useTrans();
    const isEdit = mode === 'edit';

    const { data, setData, post, put, processing, errors } = useForm({
        name: supplier?.name ?? '',
        code: supplier?.code ?? '',
        driver: supplier?.driver ?? drivers[0]?.value ?? '',
        credentials_json: '',
        is_active: supplier?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.suppliers.update', supplier.id));
        } else {
            post(route('admin.suppliers.store'));
        }
    };

    const title = isEdit ? 'Edit supplier' : 'Create supplier';

    return (
        <AdminLayout title={title}>
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Credentials are encrypted. Leave blank on edit to keep existing secrets.
                        </p>
                    </div>
                    <Link href={route('admin.suppliers.index')} className="text-sm text-cyan-300">
                        ← Back
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-navy-900/40 p-5">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="code" value="Code" />
                        <TextInput
                            id="code"
                            className="mt-1 block w-full"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                        <InputError message={errors.code} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="driver" value="Driver" />
                        <select
                            id="driver"
                            className="mt-1 block w-full rounded-md border-white/10 bg-navy-950 text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
                            value={data.driver}
                            onChange={(e) => setData('driver', e.target.value)}
                        >
                            {drivers.map((driver) => (
                                <option key={driver.value} value={driver.value}>
                                    {driver.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.driver} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="credentials_json"
                            value={
                                isEdit && supplier?.has_credentials
                                    ? 'Credentials JSON (optional replace)'
                                    : 'Credentials JSON'
                            }
                        />
                        <textarea
                            id="credentials_json"
                            rows={5}
                            className="mt-1 block w-full rounded-md border-white/10 bg-navy-950 font-mono text-xs text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
                            placeholder='{"api_key":"...","api_secret":"..."}'
                            value={data.credentials_json}
                            onChange={(e) => setData('credentials_json', e.target.value)}
                        />
                        <InputError message={errors.credentials_json} className="mt-2" />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-300">
                        <input
                            type="checkbox"
                            checked={Boolean(data.is_active)}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded border-white/20 bg-navy-950 text-cyan-500 focus:ring-cyan-400"
                        />
                        Active
                    </label>

                    <PrimaryButton disabled={processing}>{t('common.save') || 'Save'}</PrimaryButton>
                </form>
            </div>
        </AdminLayout>
    );
}

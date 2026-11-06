import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { t } = useTrans();

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || '',
            locale: user.locale || 'bn',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-white">
                    {t('nav.profile')}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    Update your name, phone, email and language preference.
                </p>
                {user.referral_code && (
                    <p className="mt-2 text-sm text-cyan-300">
                        Referral: <span className="font-semibold">{user.referral_code}</span>
                    </p>
                )}
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value={t('auth.name')} />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                        autoComplete="tel"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={`${t('auth.email')} (optional)`} />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="locale" value="Language" />
                    <select
                        id="locale"
                        className="mt-1 block w-full rounded-lg border-white/10 bg-navy-950 text-slate-100"
                        value={data.locale}
                        onChange={(e) => setData('locale', e.target.value)}
                    >
                        <option value="bn">{t('lang.bn')}</option>
                        <option value="en">{t('lang.en')}</option>
                    </select>
                    <InputError className="mt-2" message={errors.locale} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-slate-300">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ms-1 rounded-md text-sm text-cyan-300 underline"
                            >
                                Re-send verification email
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-cyan-300">
                                A new verification link has been sent.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('common.save')}</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-slate-400">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

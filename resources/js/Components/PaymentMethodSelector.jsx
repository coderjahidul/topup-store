import useTrans from '@/hooks/useTrans';

export default function PaymentMethodSelector({ methods = [], value, onChange }) {
    const { t } = useTrans();
    const selected = methods.find((method) => method.code === value);

    return (
        <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
                {methods.map((method) => (
                    <button
                        key={method.code}
                        type="button"
                        onClick={() => onChange(method.code)}
                        className={`rounded-xl border px-3 py-3 text-left transition ${
                            value === method.code
                                ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                                : 'border-white/10 bg-navy-950/60 text-slate-300 hover:border-white/25'
                        }`}
                    >
                        <p className="text-sm font-semibold">{method.name}</p>
                        {method.code === 'wallet' && method.balance !== undefined && (
                            <p className="mt-1 text-xs text-slate-400">
                                {t('game.wallet_balance')}: {t('common.bdt')}
                                {Number(method.balance).toLocaleString('en-BD')}
                            </p>
                        )}
                        {method.account_number && (
                            <p className="mt-1 text-xs text-slate-400">{method.account_number}</p>
                        )}
                    </button>
                ))}
            </div>

            {selected?.instruction && (
                <div className="rounded-xl border border-white/10 bg-navy-950/50 p-3 text-sm text-slate-300">
                    {selected.instruction}
                </div>
            )}
        </div>
    );
}

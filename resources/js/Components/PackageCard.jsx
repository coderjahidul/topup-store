import useTrans from '@/hooks/useTrans';

function formatMoney(value) {
    return Number(value).toLocaleString('en-BD', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

export default function PackageCard({
    packageItem,
    selected = false,
    onSelect,
    showGame = false,
}) {
    const { t } = useTrans();
    const hasDiscount =
        packageItem.discount_price !== null &&
        packageItem.discount_price !== undefined &&
        Number(packageItem.discount_price) < Number(packageItem.price);

    return (
        <button
            type="button"
            onClick={() => onSelect?.(packageItem)}
            className={`w-full rounded-2xl border p-4 text-left transition ${
                selected
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-glow-cyan'
                    : 'border-white/10 bg-navy-900/70 hover:border-cyan-400/40'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    {showGame && packageItem.game?.name && (
                        <p className="mb-1 text-xs text-slate-400">{packageItem.game.name}</p>
                    )}
                    <p className="font-semibold text-white">{packageItem.name}</p>
                </div>
                {hasDiscount && (
                    <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[11px] font-semibold text-orange-300">
                        {t('game.discount')}
                    </span>
                )}
            </div>
            <div className="mt-3 flex items-end gap-2">
                <span className="text-lg font-bold text-cyan-300">
                    {t('common.bdt')}
                    {formatMoney(hasDiscount ? packageItem.discount_price : packageItem.price)}
                </span>
                {hasDiscount && (
                    <span className="pb-0.5 text-sm text-slate-500 line-through">
                        {t('common.bdt')}
                        {formatMoney(packageItem.price)}
                    </span>
                )}
            </div>
        </button>
    );
}

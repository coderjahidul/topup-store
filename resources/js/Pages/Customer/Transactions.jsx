import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import useTrans from '@/hooks/useTrans';

function money(value, t) {
    return `${t('common.bdt')}${Number(value || 0).toLocaleString('en-BD')}`;
}

export default function Transactions({ balance, transactions, addMoneyRequests = [] }) {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-white">
                    {t('nav.transactions') || 'Transactions'}
                </h2>
            }
        >
            <Head title={t('nav.transactions') || 'Transactions'} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-navy-900/60 p-5">
                        <div>
                            <p className="text-sm text-slate-400">{t('game.wallet_balance')}</p>
                            <p className="text-2xl font-bold text-cyan-300">{money(balance, t)}</p>
                        </div>
                        <Link
                            href={route('wallet.add-money')}
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
                        >
                            {t('nav.add_money') || 'Add Money'}
                        </Link>
                    </div>

                    {addMoneyRequests.length > 0 && (
                        <section className="rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                            <h3 className="mb-3 font-semibold text-white">Add Money Requests</h3>
                            <div className="space-y-2">
                                {addMoneyRequests.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 px-3 py-2 text-sm"
                                    >
                                        <span className="text-slate-300">
                                            {money(item.amount, t)} · {item.payment_method} · {item.trx_id}
                                        </span>
                                        <span className="capitalize text-slate-400">{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="overflow-hidden rounded-2xl border border-white/10">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-navy-900 text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Source</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Balance</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-navy-950/40">
                                {transactions.data.map((tx) => (
                                    <tr key={tx.id}>
                                        <td className="px-4 py-3 capitalize text-slate-200">{tx.type}</td>
                                        <td className="px-4 py-3 capitalize text-slate-400">
                                            {tx.source.replaceAll('_', ' ')}
                                        </td>
                                        <td
                                            className={`px-4 py-3 font-medium ${
                                                tx.type === 'credit' ? 'text-cyan-300' : 'text-orange-300'
                                            }`}
                                        >
                                            {tx.type === 'credit' ? '+' : '-'}
                                            {money(tx.amount, t)}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">{money(tx.balance_after, t)}</td>
                                        <td className="px-4 py-3 text-slate-500">{tx.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {transactions.links?.length > 3 && (
                        <div className="flex flex-wrap gap-2">
                            {transactions.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    className={`rounded-lg px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-cyan-500 text-navy-950'
                                            : 'border border-white/10 text-slate-300'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

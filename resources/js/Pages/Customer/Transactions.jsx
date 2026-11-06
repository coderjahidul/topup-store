import AccountPageHeader from '@/Components/AccountPageHeader';
import EmptyState from '@/Components/EmptyState';
import PaginationBar from '@/Components/PaginationBar';
import StatusBadge from '@/Components/StatusBadge';
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
                <AccountPageHeader
                    eyebrow={t('nav.account') || 'My Account'}
                    title={t('nav.transactions') || 'Wallet'}
                    description={t('account.wallet_hint') || 'Balance, add-money requests, and full ledger history.'}
                    breadcrumbs={[
                        { label: t('nav.dashboard'), href: route('dashboard') },
                        { label: t('nav.transactions') || 'Wallet' },
                    ]}
                    actions={
                        <Link
                            href={route('wallet.add-money')}
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 text-sm font-bold text-navy-950"
                        >
                            {t('nav.add_money') || 'Add Money'}
                        </Link>
                    }
                />
            }
        >
            <Head title={t('nav.transactions') || 'Transactions'} />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-navy-900 to-navy-950 p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400/90">
                                {t('game.wallet_balance')}
                            </p>
                            <p className="mt-2 text-4xl font-bold text-white">{money(balance, t)}</p>
                        </div>
                        <Link
                            href={route('wallet.add-money')}
                            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
                        >
                            {t('account.top_up_wallet') || 'Top up wallet'}
                        </Link>
                    </div>
                </div>

                {addMoneyRequests.length > 0 && (
                    <section className="rounded-2xl border border-white/10 bg-navy-900/50 p-5">
                        <h2 className="text-sm font-semibold text-white">
                            {t('account.add_money_requests') || 'Add money requests'}
                        </h2>
                        <div className="mt-4 space-y-2">
                            {addMoneyRequests.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-navy-950/50 px-4 py-3 text-sm"
                                >
                                    <div>
                                        <p className="font-medium text-slate-100">{money(item.amount, t)}</p>
                                        <p className="text-xs text-slate-500">
                                            {item.payment_method} · {item.trx_id}
                                        </p>
                                    </div>
                                    <StatusBadge status={item.status} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="overflow-hidden rounded-2xl border border-white/10">
                    <div className="border-b border-white/10 bg-navy-900/80 px-5 py-4">
                        <h2 className="font-semibold text-white">{t('account.ledger') || 'Transaction ledger'}</h2>
                    </div>

                    {(transactions?.data?.length ?? 0) === 0 ? (
                        <div className="p-4">
                            <EmptyState
                                title={t('account.no_transactions') || 'No transactions yet'}
                                description={t('account.no_transactions_hint') || 'Add money or place an order to start your ledger.'}
                                actionHref={route('wallet.add-money')}
                                actionLabel={t('nav.add_money') || 'Add Money'}
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-navy-950/80 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">{t('account.type') || 'Type'}</th>
                                        <th className="px-4 py-3">{t('account.source') || 'Source'}</th>
                                        <th className="px-4 py-3">{t('game.total') || 'Amount'}</th>
                                        <th className="px-4 py-3">{t('account.balance_after') || 'Balance'}</th>
                                        <th className="px-4 py-3">{t('account.date') || 'Date'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 bg-navy-900/30">
                                    {transactions.data.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/[0.02]">
                                            <td className="px-4 py-3 capitalize text-slate-200">{tx.type}</td>
                                            <td className="px-4 py-3 capitalize text-slate-400">
                                                {(tx.source || '').replaceAll('_', ' ')}
                                            </td>
                                            <td
                                                className={`px-4 py-3 font-semibold ${
                                                    tx.type === 'credit' ? 'text-emerald-300' : 'text-orange-300'
                                                }`}
                                            >
                                                {tx.type === 'credit' ? '+' : '−'}
                                                {money(tx.amount, t)}
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">{money(tx.balance_after, t)}</td>
                                            <td className="px-4 py-3 text-slate-500">{tx.created_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <PaginationBar links={transactions?.links} />
            </div>
        </AuthenticatedLayout>
    );
}

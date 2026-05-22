'use client';

import {
  CurrencyDollar,
  Users,
  Coins,
  Wallet,
  ArrowUp,
  ArrowDown,
  CaretDown,
} from '@phosphor-icons/react';

const revenueStats = [
  { label: 'Total Revenue', value: '$284,920', change: '+18.2%', icon: CurrencyDollar, color: 'from-primary to-purple-400', up: true },
  { label: 'Active Subscribers', value: '3,847', change: '+12.5%', icon: Users, color: 'from-secondary to-emerald-400', up: true },
  { label: 'Coin Sales', value: '847,230', change: '+8.3%', icon: Coins, color: 'from-accent to-yellow-400', up: true },
  { label: 'Pending Payouts', value: '$12,480', change: '-5.2%', icon: Wallet, color: 'from-pink to-rose-400', up: false },
];

const transactions = [
  { id: '#TXN-8921', user: 'Alex Johnson', type: 'Subscription', plan: 'Premium Monthly', amount: '$19.99', status: 'Completed', date: '2026-05-23' },
  { id: '#TXN-8920', user: 'Emma Davis', type: 'Coin Purchase', plan: '500 Coins', amount: '$9.99', status: 'Completed', date: '2026-05-23' },
  { id: '#TXN-8919', user: 'Mike Brown', type: 'Subscription', plan: 'VIP Annual', amount: '$199.99', status: 'Completed', date: '2026-05-22' },
  { id: '#TXN-8918', user: 'Sarah Williams', type: 'Coin Purchase', plan: '200 Coins', amount: '$4.99', status: 'Pending', date: '2026-05-22' },
  { id: '#TXN-8917', user: 'James Wilson', type: 'Subscription', plan: 'Premium Monthly', amount: '$19.99', status: 'Failed', date: '2026-05-21' },
  { id: '#TXN-8916', user: 'Olivia Martinez', type: 'Coin Purchase', plan: '1000 Coins', amount: '$14.99', status: 'Completed', date: '2026-05-21' },
  { id: '#TXN-8915', user: 'Liam Anderson', type: 'Subscription', plan: 'Free Trial', amount: '$0.00', status: 'Completed', date: '2026-05-20' },
  { id: '#TXN-8914', user: 'Sophia Taylor', type: 'Coin Purchase', plan: '500 Coins', amount: '$9.99', status: 'Completed', date: '2026-05-20' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-secondary/15 text-secondary',
  Pending: 'bg-accent/15 text-accent',
  Failed: 'bg-destructive/15 text-destructive',
};

export default function RevenuePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Revenue</h1>
        <p className="text-text-muted text-sm mt-1">Track earnings and transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueStats.map((stat) => (
          <div key={stat.label} className="glass-card-static p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} weight="fill" className="text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-secondary' : 'text-destructive'}`}>
                {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-text-muted text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card-static p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span>Last 7 days</span>
              <CaretDown size={14} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Transaction</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium hidden sm:table-cell">User</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Plan</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Amount</th>
                  <th className="text-center py-3 px-4 text-text-muted font-medium hidden lg:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-text-muted">{tx.id}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">{tx.user}</td>
                    <td className="py-3 px-4">{tx.type}</td>
                    <td className="py-3 px-4 hidden md:table-cell text-text-muted">{tx.plan}</td>
                    <td className="py-3 px-4 text-right font-medium">{tx.amount}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card-static p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-muted">Subscriptions</span>
                <span className="font-medium">$192,450</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[67.5%] rounded-full bg-gradient-to-r from-primary to-primary-light" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-muted">Coin Sales</span>
                <span className="font-medium">$67,230</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[23.6%] rounded-full bg-gradient-to-r from-accent to-yellow-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-muted">Ads</span>
                <span className="font-medium">$18,940</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[6.6%] rounded-full bg-gradient-to-r from-secondary to-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-muted">Other</span>
                <span className="font-medium">$6,300</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[2.3%] rounded-full bg-gradient-to-r from-pink to-rose-400" />
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-6 pt-6">
            <h3 className="text-sm font-medium mb-3">Subscription Tiers</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Free</span>
                <span className="font-medium">8,420</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Premium</span>
                <span className="font-medium">2,847</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">VIP</span>
                <span className="font-medium">1,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

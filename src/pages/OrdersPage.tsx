import React from 'react';
import { Link } from 'react-router-dom';
import { MALL_ORDERS, ORDER_STATUS_STYLES } from '@/lib/mallData';

const ACTIVITY_FEED = [
  { icon: '📦', text: 'Your SupplyHub Co. order shipped — arriving Thursday.', time: 'Today' },
  { icon: '💬', text: 'GrahmOS agent priced your packaging quote request.', time: 'Yesterday' },
  { icon: '🏪', text: 'Circuit & Co. added 3 new products to the Electronics aisle.', time: '2 days ago' },
  { icon: '⚡', text: 'You earned 120 GrahmOS Rewards points on your last order.', time: '5 days ago' },
];

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight mb-2">Orders &amp; Mall Activity</h1>
        <p className="text-[var(--os-text-secondary)] font-medium">
          Everything you've ordered across the mall, plus what's happening around it.
        </p>
      </div>

      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders table */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black mb-6">Your orders</h2>
          <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--os-border)] text-[var(--os-text-secondary)] text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Storefront</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--os-border)]">
                {MALL_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--os-surface-2)] transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-sm">{order.id}</div>
                      <div className="text-xs text-[var(--os-text-secondary)] font-medium">{order.summary}</div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-sm">{order.storefront}</td>
                    <td className="px-6 py-5 text-right font-black text-sm">${order.total.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right text-sm font-medium text-[var(--os-text-secondary)]">{order.date}</td>
                    <td className="px-6 py-5 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${ORDER_STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-sm font-medium text-[var(--os-text-secondary)]">
            Need something you've ordered before?{' '}
            <Link to="/mall/quotes" className="text-[var(--os-blue)] font-bold hover:underline">
              Request a re-order quote →
            </Link>
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="text-xl font-black mb-6">Mall activity</h2>
          <div className="space-y-3">
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--os-surface-2)] flex items-center justify-center text-xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-relaxed">{item.text}</p>
                  <span className="text-xs font-bold text-[var(--os-text-tertiary)] uppercase tracking-wider">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

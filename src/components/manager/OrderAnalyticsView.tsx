import React, { useState } from 'react';
import {
  ShoppingBagIcon,
  ClockIcon,
  AlertTriangleIcon,
  FilterIcon,
} from '../Icons';

export const OrderAnalyticsView: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'dine-in' | 'delivery'>('all');

  const mockOrders = [
    { id: 'SAV-7080', table: 'Table 04', type: 'dine-in', items: 4, total: 18950, prepMinutes: 18, status: 'completed', server: 'Marco Rossi' },
    { id: 'SAV-7075', table: 'Delivery: Colaba', type: 'delivery', items: 3, total: 4200, prepMinutes: 22, status: 'completed', server: 'Delivery Partner' },
    { id: 'SAV-7072', table: 'Table 06', type: 'dine-in', items: 6, total: 34200, prepMinutes: 25, status: 'completed', server: 'Devan Nair' },
    { id: 'SAV-7068', table: 'Table 02', type: 'dine-in', items: 3, total: 12400, prepMinutes: 16, status: 'completed', server: 'Priya Verma' },
    { id: 'SAV-7065', table: 'Table 01', type: 'dine-in', items: 2, total: 5850, prepMinutes: 14, status: 'completed', server: 'Marco Rossi' },
    { id: 'SAV-7060', table: 'Table 14', type: 'dine-in', items: 2, total: 5733, prepMinutes: 19, status: 'voided', reason: 'Guest doneness dissatisfaction', server: 'Arjun Khanna' },
  ];

  const filtered = filterType === 'all' ? mockOrders : mockOrders.filter((o) => o.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
            <ShoppingBagIcon size={22} className="text-amber-400" />
            <span>Order Velocity & Fulfillment Analytics</span>
          </h2>
          <p className="text-xs text-[#8c7b6d]">
            Turnaround times, course stage delays, delivery dispatch speed, and cancellation telemetry
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1b1410] border border-[#34271c]">
          {(['all', 'dine-in', 'delivery'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterType === t
                  ? 'bg-amber-500 text-[#140f0c] font-bold shadow-md'
                  : 'text-[#a89689] hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Channels' : t === 'dine-in' ? 'Dine-In' : 'Home Delivery'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Pipeline Speed Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mgr-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Average Total Fulfillment</span>
            <ClockIcon size={16} className="text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-amber-200">
            18.4 mins
          </div>
          <div className="text-[11px] text-emerald-400">
            Within 22m restaurant benchmark
          </div>
        </div>

        <div className="mgr-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Kitchen Cooking Duration</span>
            <ClockIcon size={16} className="text-blue-400" />
          </div>
          <div className="font-mono text-2xl font-black text-blue-200">
            14.2 mins
          </div>
          <div className="text-[11px] text-[#8c7b6d]">
            From ticket fire to plate pass
          </div>
        </div>

        <div className="mgr-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Order Void & Return Rate</span>
            <AlertTriangleIcon size={16} className="text-red-400" />
          </div>
          <div className="font-mono text-2xl font-black text-red-300">
            1.2%
          </div>
          <div className="text-[11px] text-emerald-400">
            Low (1 void out of 86 checks)
          </div>
        </div>

        <div className="mgr-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Peak Dinner Density</span>
            <FilterIcon size={16} className="text-purple-400" />
          </div>
          <div className="font-mono text-2xl font-black text-purple-200">
            28 Orders/hr
          </div>
          <div className="text-[11px] text-[#8c7b6d]">
            Recorded between 20:00 - 21:00
          </div>
        </div>
      </div>

      {/* Cancellation / Void Reason Log & Fulfillment Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Fulfillment Funnel (5 cols) */}
        <div className="lg:col-span-5 mgr-card p-5 space-y-4">
          <h3 className="mgr-card-title border-b border-[#241a12] pb-3">
            Fulfillment Stage Telemetry
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-[#2b2018] bg-[#120d09] space-y-1">
              <div className="flex justify-between text-xs font-bold text-amber-200">
                <span>1. Order Placed → Kitchen Fire</span>
                <span className="font-mono">1.8 mins avg</span>
              </div>
              <p className="text-[11px] text-[#8c7b6d]">Floor Captain review & course tagging</p>
            </div>

            <div className="p-3 rounded-xl border border-[#2b2018] bg-[#120d09] space-y-1">
              <div className="flex justify-between text-xs font-bold text-amber-200">
                <span>2. Active Cooking on Line</span>
                <span className="font-mono">14.2 mins avg</span>
              </div>
              <p className="text-[11px] text-[#8c7b6d]">Grill, Sauté & Oven preparation</p>
            </div>

            <div className="p-3 rounded-xl border border-[#2b2018] bg-[#120d09] space-y-1">
              <div className="flex justify-between text-xs font-bold text-amber-200">
                <span>3. Expedite Pass → Plated to Table</span>
                <span className="font-mono">2.4 mins avg</span>
              </div>
              <p className="text-[11px] text-[#8c7b6d]">Garnish, cloche cover & server runner</p>
            </div>
          </div>
        </div>

        {/* Right: Recent Orders Performance Table (7 cols) */}
        <div className="lg:col-span-7 mgr-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#241a12] pb-3">
            <h3 className="mgr-card-title">Order Turnaround Log</h3>
            <span className="text-xs text-[#8c7b6d]">{filtered.length} Orders displayed</span>
          </div>

          <div className="mgr-table-wrapper">
            <table className="mgr-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Destination</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Prep Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ord) => (
                  <tr key={ord.id}>
                    <td className="font-mono font-bold text-amber-300">{ord.id}</td>
                    <td className="text-xs text-[#c9b8ad]">{ord.table}</td>
                    <td className="text-xs text-[#a89689]">{ord.items} items</td>
                    <td className="font-mono font-bold text-amber-200">₹{ord.total.toLocaleString()}</td>
                    <td className="font-mono text-xs text-[#a89689]">{ord.prepMinutes}m</td>
                    <td>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

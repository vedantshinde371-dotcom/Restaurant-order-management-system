import React, { useState } from 'react';
import type {
  ManagerCategoryShare,
  ManagerSalesPoint,
} from '../../data/mockRestaurantData';
import {
  DollarSignIcon,
  CreditCardIcon,
  QrCodeIcon,
  BanknoteIcon,
  DownloadIcon,
  PercentIcon,
} from '../Icons';

interface SalesRevenueAnalyticsViewProps {
  hourlySales: ManagerSalesPoint[];
  categoryShares: ManagerCategoryShare[];
}

export const SalesRevenueAnalyticsView: React.FC<SalesRevenueAnalyticsViewProps> = ({
  hourlySales,
  categoryShares,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');

  // Aggregated totals based on mock data
  const totalRevenue = hourlySales.reduce((acc, h) => acc + h.total, 0);
  const totalDineIn = hourlySales.reduce((acc, h) => acc + h.dineIn, 0);
  const totalDelivery = hourlySales.reduce((acc, h) => acc + h.delivery, 0);

  const dineInPercent = Math.round((totalDineIn / (totalRevenue || 1)) * 100);
  const deliveryPercent = 100 - dineInPercent;

  // Tender breakdowns
  const upiCollected = Math.round(totalRevenue * 0.44);
  const cardCollected = Math.round(totalRevenue * 0.38);
  const cashCollected = totalRevenue - upiCollected - cardCollected;

  const totalGst = Math.round(totalRevenue * 0.05);
  const totalServiceCharge = Math.round(totalRevenue * 0.05);
  const discountsGiven = 12450;

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
            <DollarSignIcon size={22} className="text-amber-400" />
            <span>Sales & Revenue Analytics</span>
          </h2>
          <p className="text-xs text-[#8c7b6d]">
            Multi-channel revenue intelligence, payment mode reconciliations, and category shares
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1b1410] border border-[#34271c]">
          {(['today', 'yesterday', 'week', 'month'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                timeRange === r
                  ? 'bg-amber-500 text-[#140f0c] font-bold shadow-md'
                  : 'text-[#a89689] hover:text-white'
              }`}
            >
              {r === 'today' ? 'Today' : r === 'yesterday' ? 'Yesterday' : r === 'week' ? 'Last 7 Days' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Financial Breakdown Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mgr-card p-4 space-y-1">
          <div className="text-xs text-[#8c7b6d]">Gross Collections</div>
          <div className="font-mono text-2xl font-black text-amber-200">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            ↑ 14.8% vs last cycle
          </div>
        </div>

        <div className="mgr-card p-4 space-y-1">
          <div className="text-xs text-[#8c7b6d]">GST Collected (2.5% + 2.5%)</div>
          <div className="font-mono text-2xl font-black text-blue-200">
            ₹{totalGst.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#8c7b6d]">
            CGST: ₹{(totalGst / 2).toLocaleString()} • SGST: ₹{(totalGst / 2).toLocaleString()}
          </div>
        </div>

        <div className="mgr-card p-4 space-y-1">
          <div className="text-xs text-[#8c7b6d]">Service Charge (5%)</div>
          <div className="font-mono text-2xl font-black text-purple-200">
            ₹{totalServiceCharge.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#8c7b6d]">
            Allocated to floor staff pool
          </div>
        </div>

        <div className="mgr-card p-4 space-y-1">
          <div className="text-xs text-[#8c7b6d]">Total Discounts Absorbed</div>
          <div className="font-mono text-2xl font-black text-red-300">
            ₹{discountsGiven.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#8c7b6d]">
            Coupons + Manager waivers
          </div>
        </div>
      </div>

      {/* Tender Method Reconciliations & Channel Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Tender Share Distribution (6 cols) */}
        <div className="lg:col-span-6 mgr-card p-5 space-y-4">
          <h3 className="mgr-card-title flex items-center justify-between border-b border-[#241a12] pb-3">
            <span>Payment Tender Reconciliation</span>
            <span className="text-xs text-[#8c7b6d]">Settlement Modes</span>
          </h3>

          <div className="space-y-3">
            {/* UPI */}
            <div className="p-3 rounded-xl border border-[#2b2018] bg-[#120d09] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-blue-300">
                  <QrCodeIcon size={16} />
                  <span>UPI Dynamic QR (GPay, PhonePe, Paytm)</span>
                </span>
                <span className="font-mono font-bold text-amber-200">
                  ₹{upiCollected.toLocaleString()} (44%)
                </span>
              </div>
              <div className="w-full bg-[#1e1610] rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '44%' }} />
              </div>
            </div>

            {/* Credit/Debit Card */}
            <div className="p-3 rounded-xl border border-[#2b2018] bg-[#120d09] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-purple-300">
                  <CreditCardIcon size={16} />
                  <span>Card EDC Terminals (Visa, MC, RuPay)</span>
                </span>
                <span className="font-mono font-bold text-amber-200">
                  ₹{cardCollected.toLocaleString()} (38%)
                </span>
              </div>
              <div className="w-full bg-[#1e1610] rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            {/* Physical Cash */}
            <div className="p-3 rounded-xl border border-[#2b2018] bg-[#120d09] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-emerald-300">
                  <BanknoteIcon size={16} />
                  <span>Cash Drawer Currency</span>
                </span>
                <span className="font-mono font-bold text-amber-200">
                  ₹{cashCollected.toLocaleString()} (18%)
                </span>
              </div>
              <div className="w-full bg-[#1e1610] rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Channel Split: Dine-In vs Delivery (6 cols) */}
        <div className="lg:col-span-6 mgr-card p-5 space-y-4">
          <h3 className="mgr-card-title flex items-center justify-between border-b border-[#241a12] pb-3">
            <span>Dine-In vs Delivery Split</span>
            <span className="text-xs text-[#8c7b6d]">Fulfillment Ratio</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/15 space-y-1">
              <span className="text-xs text-amber-400 font-bold uppercase">Dine-In Covers</span>
              <div className="font-mono text-2xl font-black text-amber-200">
                ₹{totalDineIn.toLocaleString()}
              </div>
              <span className="text-xs text-[#8c7b6d]">{dineInPercent}% of total revenue</span>
            </div>

            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/15 space-y-1">
              <span className="text-xs text-blue-400 font-bold uppercase">Delivery Orders</span>
              <div className="font-mono text-2xl font-black text-blue-200">
                ₹{totalDelivery.toLocaleString()}
              </div>
              <span className="text-xs text-[#8c7b6d]">{deliveryPercent}% of total revenue</span>
            </div>
          </div>

          {/* Visual Bar Ratio */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-[#8c7b6d]">
              <span>Dine-In ({dineInPercent}%)</span>
              <span>Delivery ({deliveryPercent}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#201711] flex overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${dineInPercent}%` }} />
              <div className="bg-blue-500 h-full" style={{ width: `${deliveryPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Sales Performance Table */}
      <div className="mgr-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#241a12] pb-3">
          <h3 className="mgr-card-title flex items-center gap-2">
            <PercentIcon size={18} className="text-amber-400" />
            <span>Category Revenue Contribution Matrix</span>
          </h3>
          <button
            type="button"
            className="mgr-btn-secondary"
            onClick={() => alert('Exporting sales matrix report...')}
          >
            <DownloadIcon size={13} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="mgr-table-wrapper">
          <table className="mgr-table">
            <thead>
              <tr>
                <th>Menu Category</th>
                <th>Orders Count</th>
                <th>Revenue Generated</th>
                <th>Share %</th>
                <th>Margin Health</th>
              </tr>
            </thead>
            <tbody>
              {categoryShares.map((cat) => (
                <tr key={cat.category}>
                  <td className="font-semibold text-amber-100 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.category}</span>
                  </td>
                  <td className="font-mono text-[#a89689]">{cat.orders} orders</td>
                  <td className="font-mono font-bold text-amber-200">
                    ₹{cat.revenue.toLocaleString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#241a12] rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                        />
                      </div>
                      <span className="font-mono text-xs text-[#a89689]">{cat.percent}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Healthy (~68%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

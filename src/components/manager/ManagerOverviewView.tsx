import React from 'react';
import type {
  ManagerKPI,
  ManagerSalesPoint,
  ManagerStationConfig,
  ManagerInventoryItem,
  ManagerCustomerReview,
} from '../../data/mockRestaurantData';
import {
  DollarSignIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChefHatIcon,
  AlertTriangleIcon,
  StarIcon,
  ArrowRightIcon,
  ActivityIcon,
  SlidersIcon,
  TagIcon,
  FileTextIcon,
  UtensilsIcon,
} from '../Icons';

interface ManagerOverviewViewProps {
  kpi: ManagerKPI;
  hourlySales: ManagerSalesPoint[];
  stations: ManagerStationConfig[];
  inventory: ManagerInventoryItem[];
  reviews: ManagerCustomerReview[];
  onNavigateTab: (tab: string) => void;
}

export const ManagerOverviewView: React.FC<ManagerOverviewViewProps> = ({
  kpi,
  hourlySales,
  stations,
  inventory,
  reviews,
  onNavigateTab,
}) => {
  const criticalStockItems = inventory.filter((i) => i.status === 'critical' || i.status === 'low');
  const recentReviews = reviews.slice(0, 3);
  const maxSale = Math.max(...hourlySales.map((h) => h.total), 1);

  return (
    <div className="space-y-6">
      {/* 1. Executive Welcome & Quick Action Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-gradient-to-r from-[#17110c] via-[#1a130e] to-[#120d09] p-5 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 uppercase tracking-widest">
              Executive Command Center
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
            Savoria Grand Palace • General Manager Portal
          </h2>
          <p className="text-xs text-[#a89689]">
            Real-time analytics, floor synchronization, inventory auto-depletion, and operational audit.
          </p>
        </div>

        {/* Quick Launch Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('menu')}
            className="mgr-btn-secondary"
          >
            <UtensilsIcon size={14} className="text-amber-400" />
            <span>Manage Menu</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('inventory')}
            className="mgr-btn-secondary"
          >
            <AlertTriangleIcon size={14} className="text-amber-400" />
            <span>Stock & 86</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('staff')}
            className="mgr-btn-secondary"
          >
            <UsersIcon size={14} className="text-amber-400" />
            <span>Staff Roster</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('reports')}
            className="mgr-btn-gold"
          >
            <FileTextIcon size={14} />
            <span>Generate Reports</span>
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Grid (8 Key Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Metric 1: Today's Gross Revenue */}
        <div className="mgr-card p-4 space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Today Gross Revenue</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSignIcon size={16} />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-amber-200">
            ₹{kpi.todayRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <span>↑ +{kpi.revenueGrowth}%</span>
            <span className="text-[#6b5d52]">vs yesterday</span>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="mgr-card p-4 space-y-2 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Total Orders Settled</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBagIcon size={16} />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-blue-200">
            {kpi.totalOrders}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <span>↑ +{kpi.orderGrowth}%</span>
            <span className="text-[#6b5d52]">114 receipts</span>
          </div>
        </div>

        {/* Metric 3: Average Order Value (AOV) */}
        <div className="mgr-card p-4 space-y-2 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Average Order Value</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <TagIcon size={16} />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-purple-200">
            ₹{kpi.averageOrderValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#8c7b6d]">
            Per ticket spending index
          </div>
        </div>

        {/* Metric 4: Floor Occupancy */}
        <div className="mgr-card p-4 space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Floor Table Occupancy</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <UsersIcon size={16} />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-emerald-300">
            {kpi.occupancyRate}%
          </div>
          <div className="text-[11px] text-[#8c7b6d]">
            {kpi.activeTablesCount} / 12 active covers
          </div>
        </div>

        {/* Metric 5: Food Cost % */}
        <div className="mgr-card p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Cost of Goods (COGS)</span>
            <span className="text-[10px] text-emerald-400 font-bold">Target: &lt;30%</span>
          </div>
          <div className="font-mono text-2xl font-black text-amber-100">
            {kpi.foodCostPercent}%
          </div>
          <div className="w-full bg-[#241a12] rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${kpi.foodCostPercent}%` }} />
          </div>
        </div>

        {/* Metric 6: Low Stock Items */}
        <div className="mgr-card p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Critical Stock Alerts</span>
            <AlertTriangleIcon size={16} className="text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-amber-300">
            {criticalStockItems.length} Items
          </div>
          <div className="text-[11px] text-amber-400/90 font-medium">
            Requires supplier reorder
          </div>
        </div>

        {/* Metric 7: Staff On Duty */}
        <div className="mgr-card p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Staff On Shift</span>
            <ChefHatIcon size={16} className="text-blue-400" />
          </div>
          <div className="font-mono text-2xl font-black text-blue-200">
            {kpi.staffOnDuty} Staff
          </div>
          <div className="text-[11px] text-[#8c7b6d]">
            Kitchen: 6 • Service: 6 • Billing: 2
          </div>
        </div>

        {/* Metric 8: Guest Satisfaction Score */}
        <div className="mgr-card p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Guest Rating Index</span>
            <StarIcon size={16} className="text-amber-400 fill-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-amber-200 flex items-baseline gap-1">
            <span>{kpi.customerSatisfactionScore}</span>
            <span className="text-xs text-[#8c7b6d]">/ 5.0</span>
          </div>
          <div className="text-[11px] text-emerald-400">
            96% positive sentiment
          </div>
        </div>
      </div>

      {/* 3. Hourly Sales Trend & Station Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Hourly Sales Area / Bar Chart (8 cols) */}
        <div className="lg:col-span-8 mgr-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#241a12] pb-3">
            <div>
              <h3 className="mgr-card-title flex items-center gap-2">
                <ActivityIcon size={18} className="text-amber-400" />
                <span>Today Hourly Revenue Curve (12:00 - 22:00)</span>
              </h3>
              <p className="text-xs text-[#8c7b6d]">Dine-In vs Home Delivery revenue distribution by hour</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Dine-In
              </span>
              <span className="flex items-center gap-1.5 text-blue-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Delivery
              </span>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-56 w-full pt-4 flex items-end gap-2 sm:gap-3 px-2">
            {hourlySales.map((pt) => {
              const dineHeight = Math.round((pt.dineIn / maxSale) * 160);
              const deliveryHeight = Math.round((pt.delivery / maxSale) * 160);

              return (
                <div key={pt.timeLabel} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-[#251a13] border border-amber-500/40 text-[10px] text-amber-200 px-2 py-1 rounded shadow-xl pointer-events-none z-10 whitespace-nowrap">
                    ₹{pt.total.toLocaleString()} ({pt.timeLabel})
                  </div>

                  {/* Stacked Bar */}
                  <div className="w-full max-w-[28px] flex flex-col-reverse rounded-t-md overflow-hidden bg-[#1f1712]">
                    <div
                      className="bg-gradient-to-t from-amber-600 to-amber-400 w-full transition-all duration-300"
                      style={{ height: `${dineHeight}px` }}
                    />
                    <div
                      className="bg-gradient-to-t from-blue-600 to-blue-400 w-full transition-all duration-300"
                      style={{ height: `${deliveryHeight}px` }}
                    />
                  </div>

                  <span className="text-[10px] text-[#8c7b6d] font-mono">{pt.timeLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#8c7b6d] pt-2 border-t border-[#241a12]">
            <span>Peak Hour: <strong className="text-amber-300">21:00 (Dinner Rush - ₹41,800)</strong></span>
            <button
              type="button"
              onClick={() => onNavigateTab('sales')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <span>Detailed Sales Analytics</span>
              <ArrowRightIcon size={12} />
            </button>
          </div>
        </div>

        {/* Right: Kitchen & Prep Stations Live Radar (4 cols) */}
        <div className="lg:col-span-4 mgr-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#241a12] pb-3">
              <h3 className="mgr-card-title flex items-center gap-2">
                <ChefHatIcon size={18} className="text-amber-400" />
                <span>Station Health</span>
              </h3>
              <span className="text-[11px] text-[#8c7b6d]">6 Lines</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {stations.map((stn) => {
                const loadPercent = Math.round((stn.activeTickets / stn.capacityTickets) * 100);
                const isBusy = stn.status === 'busy' || loadPercent >= 80;

                return (
                  <div
                    key={stn.id}
                    className="p-2.5 rounded-xl border border-[#241a12] bg-[#120d09] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-semibold text-amber-100 truncate">{stn.name}</div>
                      <div className="text-[10px] text-[#8c7b6d] truncate">Lead: {stn.leadChef}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          isBusy ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {stn.activeTickets}/{stn.capacityTickets} tkts
                      </span>
                      <span className="text-[11px] font-mono text-[#a89689]">{stn.avgPrepMinutes}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('kitchen-config')}
            className="w-full py-2 rounded-xl border border-[#3d2f26] bg-[#18110b] text-xs font-semibold text-amber-300 hover:bg-[#221810] transition-colors flex items-center justify-center gap-2"
          >
            <SlidersIcon size={13} />
            <span>Configure Routing & Stations</span>
          </button>
        </div>
      </div>

      {/* 4. Critical Stock Feed & Recent Guest Feedback Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Inventory Alert & 86 Auto-Status (6 cols) */}
        <div className="lg:col-span-6 mgr-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#241a12] pb-3">
            <h3 className="mgr-card-title flex items-center gap-2">
              <AlertTriangleIcon size={18} className="text-amber-400" />
              <span>Ingredient Stock Warnings & 86 Radar</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-amber-400 hover:underline"
            >
              View All ({inventory.length})
            </button>
          </div>

          <div className="space-y-2">
            {criticalStockItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-[#2b1f17] bg-[#110d0a] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-amber-100 flex items-center gap-2">
                    <span>{item.name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        item.status === 'critical' ? 'mgr-badge-critical' : 'mgr-badge-low'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8c7b6d]">
                    Supplier: {item.supplier} • Min: {item.minThreshold} {item.unit}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-amber-200">
                    {item.currentStock} {item.unit}
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('inventory')}
                    className="text-[10px] text-amber-400 hover:text-white underline mt-0.5"
                  >
                    Restock PO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Guest Feedback & NPS (6 cols) */}
        <div className="lg:col-span-6 mgr-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#241a12] pb-3">
            <h3 className="mgr-card-title flex items-center gap-2">
              <StarIcon size={18} className="text-amber-400" />
              <span>Recent Guest Reviews & Sentiment</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('feedback')}
              className="text-xs text-amber-400 hover:underline"
            >
              Feedback Studio
            </button>
          </div>

          <div className="space-y-2.5">
            {recentReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3 rounded-xl border border-[#241a12] bg-[#120d09] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-100">{rev.customerName}</span>
                    <span className="text-[10px] text-[#8c7b6d]">{rev.tableNumber}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <span>★ {rev.rating}.0</span>
                    <span className="text-[10px] text-[#8c7b6d] font-normal font-mono">{rev.date}</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#c9b8ad] italic line-clamp-2">
                  "{rev.comment}"
                </p>
                {rev.managerReply && (
                  <div className="text-[10px] text-emerald-400 bg-emerald-950/20 px-2 py-1 rounded border border-emerald-500/20">
                    Manager Replied: {rev.managerReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

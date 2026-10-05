import React from 'react';
import type { KitchenStockItem, KitchenTicket } from '../../data/mockRestaurantData';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChefHatIcon,
  ClockIcon,
  FlameIcon,
  LayersIcon,
  PackageXIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
  TimerIcon,
  UserIcon,
} from '../Icons';

interface KitchenOverviewViewProps {
  tickets: KitchenTicket[];
  completedTickets: KitchenTicket[];
  stockItems: KitchenStockItem[];
  onSelectNav: (tab: string) => void;
  onOpenDetails: (ticket: KitchenTicket) => void;
  onOpenPriority: (ticket: KitchenTicket) => void;
  onOpenDelay: (ticket: KitchenTicket) => void;
}

export const KitchenOverviewView: React.FC<KitchenOverviewViewProps> = ({
  tickets,
  completedTickets,
  stockItems,
  onSelectNav,
  onOpenDetails,
  onOpenPriority,
  onOpenDelay,
}) => {
  const activeTickets = tickets.filter((t) => t.status !== 'completed');
  const queuedTickets = tickets.filter((t) => t.status === 'queued');
  const cookingTickets = tickets.filter((t) => t.status === 'cooking' || t.status === 'preparing');
  const readyTickets = tickets.filter((t) => t.status === 'ready');
  const delayedTickets = activeTickets.filter(
    (t) => t.isDelayed || t.elapsedMinutes > (t.estimatedTimeMinutes || t.targetMinutes || 15)
  );

  const stock86Count = stockItems.filter(
    (i) => i.status === '86-out-of-stock' || i.status === 'out-of-stock'
  ).length;

  const urgentTickets = activeTickets.filter(
    (t) => t.priority === 'rush' || t.priority === 'vip' || t.priority === 'urgent' || t.priority === 'recook'
  );

  // 5 Station load calculations
  const stationConfigs = [
    { id: 'grill', name: 'Charcoal & Wood Grill', chef: 'Marco Rossi', max: 12, color: 'from-orange-600/30 to-red-600/10 border-orange-500/40 text-orange-300' },
    { id: 'saute', name: 'Fish & Sauté Line', chef: 'Claire Dupont', max: 10, color: 'from-amber-600/30 to-yellow-600/10 border-amber-500/40 text-amber-300' },
    { id: 'pasta', name: 'Pasta & Risotto', chef: 'Matteo Conti', max: 8, color: 'from-yellow-600/30 to-amber-600/10 border-yellow-500/40 text-yellow-300' },
    { id: 'cold', name: 'Garde Manger & Raw Bar', chef: 'Elena Rostova', max: 14, color: 'from-cyan-600/30 to-blue-600/10 border-cyan-500/40 text-cyan-300' },
    { id: 'pastry', name: 'Pastry & Soufflé', chef: 'Yvaine Chen', max: 8, color: 'from-purple-600/30 to-pink-600/10 border-purple-500/40 text-purple-300' },
  ];

  const stationLoads = stationConfigs.map((stn) => {
    let panCount = 0;
    activeTickets.forEach((t) => {
      t.items.forEach((item) => {
        if (item.station === stn.id && !(item.isCompleted ?? item.completed)) {
          panCount += item.quantity;
        }
      });
    });
    const pct = Math.min(100, Math.round((panCount / stn.max) * 100));
    return { ...stn, count: panCount, pct };
  });

  return (
    <div className="space-y-6">
      {/* 4 Main Operations KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div
          onClick={() => onSelectNav('prep')}
          className="rounded-2xl border border-[#34271c] bg-[#140f0c] p-4.5 transition-all hover:border-[#c9893d]/60 cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-[#8c7b6d] text-xs">
            <span>Cooking on Line</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20">
              <ChefHatIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-[#f5ede4]">
            {cookingTickets.length}
          </div>
          <p className="mt-1 text-[11px] text-[#8c7b6d] flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Station Rails</span>
          </p>
        </div>

        <div
          onClick={() => onSelectNav('queue')}
          className="rounded-2xl border border-[#34271c] bg-[#140f0c] p-4.5 transition-all hover:border-[#c9893d]/60 cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-[#8c7b6d] text-xs">
            <span>New Order Queue</span>
            <div className="h-8 w-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20">
              <ClockIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-amber-200">
            {queuedTickets.length}
          </div>
          <p className="mt-1 text-[11px] text-orange-400 font-medium">
            {queuedTickets.length > 0 ? 'Requires fire dispatch' : 'Queue all cleared'}
          </p>
        </div>

        <div
          onClick={() => onSelectNav('pass')}
          className="rounded-2xl border border-[#34271c] bg-[#140f0c] p-4.5 transition-all hover:border-[#c9893d]/60 cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-[#8c7b6d] text-xs">
            <span>Ready on Pass</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20">
              <CheckCircleIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
            {readyTickets.length}
          </div>
          <p className="mt-1 text-[11px] text-[#8c7b6d]">
            Awaiting server pickup
          </p>
        </div>

        <div
          onClick={() => onSelectNav('history')}
          className="rounded-2xl border border-[#34271c] bg-[#140f0c] p-4.5 transition-all hover:border-[#c9893d]/60 cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-[#8c7b6d] text-xs">
            <span>Shift Cleared</span>
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20">
              <RotateCcwIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-cyan-300">
            {completedTickets.length}
          </div>
          <p className="mt-1 text-[11px] text-emerald-400">
            97.4% on-time pace
          </p>
        </div>
      </div>

      {/* Critical Alerts Banner (Delays & 86 Items) */}
      {(delayedTickets.length > 0 || stock86Count > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {delayedTickets.length > 0 && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                  <TimerIcon size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-300">
                    {delayedTickets.length} Ticket(s) Exceeding Target Time
                  </h4>
                  <p className="text-[11px] text-red-200/80">
                    Line resting bottleneck detected. Service staff advised.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectNav('prep')}
                className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500"
              >
                Inspect
              </button>
            </div>
          )}

          {stock86Count > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <PackageXIcon size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {stock86Count} Menu Items 86'd Tonight
                  </h4>
                  <p className="text-[11px] text-amber-200/80">
                    Wild Sea Bass & Soft Shell Crab unavailable for service.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectNav('inventory')}
                className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-[#140f0c] hover:bg-amber-500"
              >
                86 Board
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5 Kitchen Stations Load Capacity Grid */}
      <div className="rounded-2xl border border-[#34271c] bg-[#140f0c] p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#241a14] pb-4 mb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-amber-100 flex items-center gap-2">
              <LayersIcon size={16} className="text-amber-400" />
              Kitchen Station Line Capacities
            </h3>
            <p className="text-xs text-[#8c7b6d] mt-0.5">
              Live pan count and workload distribution across all 5 production lines
            </p>
          </div>
          <button
            onClick={() => onSelectNav('stations')}
            className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
          >
            <span>View Station Rails</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stationLoads.map((stn) => (
            <div
              key={stn.id}
              onClick={() => onSelectNav('stations')}
              className="rounded-xl border border-[#2d221b] bg-[#18110d] p-3.5 hover:border-[#4d3a2e] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">
                    {stn.name.split('&')[0]}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300">
                    {stn.count}/{stn.max}
                  </span>
                </div>
                <div className="text-[11px] text-[#8c7b6d] flex items-center gap-1">
                  <UserIcon size={11} /> {stn.chef}
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-[#7a6a5f] mb-1">
                  <span>Load Meter</span>
                  <span className={stn.pct > 75 ? 'text-red-400 font-bold' : 'text-[#a89687]'}>
                    {stn.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#241a12] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stn.pct > 75 ? 'bg-red-500' : stn.pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stn.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent VIP & High Priority Radar */}
      <div className="rounded-2xl border border-[#34271c] bg-[#140f0c] p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#241a14] pb-4 mb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-amber-100 flex items-center gap-2">
              <FlameIcon size={16} className="text-amber-400" />
              Priority Radar & VIP Expedite Tracking
            </h3>
            <p className="text-xs text-[#8c7b6d] mt-0.5">
              High-priority guest tables, rapid courier dispatches, and severe allergy flags
            </p>
          </div>
          <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-xs font-bold text-amber-300">
            {urgentTickets.length} Priority Tickets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {urgentTickets.slice(0, 3).map((t) => {
            const isDelivery = t.orderType === 'delivery' || t.orderType === 'home-delivery';
            const targetMins = t.estimatedTimeMinutes || t.targetMinutes || 15;
            const allergies = t.allergies || t.allergyAlerts;

            return (
              <div
                key={t.id}
                className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-[#1b140f] to-[#140f0c] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between border-b border-[#2d221b] pb-2.5 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-amber-300">
                          #{t.orderNumber}
                        </span>
                        {isDelivery ? (
                          <span className="rounded bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 text-[10px] font-bold text-blue-300 flex items-center gap-1">
                            <ShoppingBagIcon size={10} /> Delivery
                          </span>
                        ) : (
                          <span className="rounded bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-200">
                            Table {t.tableNumber}
                          </span>
                        )}
                        <span className="rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                          {t.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8c7b6d] mt-1">
                        Course: {t.course || t.courseStage} • Recv: {t.receivedAt || t.placedAt}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {t.elapsedMinutes}m / {targetMins}m
                      </span>
                    </div>
                  </div>

                  {allergies && allergies.length > 0 && (
                    <div className="rounded-lg bg-red-950/40 border border-red-500/40 p-2 mb-2 text-[11px] text-red-200 font-semibold flex items-center gap-1.5">
                      <AlertTriangleIcon size={12} className="text-red-400 shrink-0" />
                      <span>{allergies.join(', ')}</span>
                    </div>
                  )}

                  <div className="space-y-1 mb-3">
                    {t.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="text-xs text-[#c9b8ad] flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-[10px] uppercase text-[#8c7b6d] font-bold">{item.station}</span>
                      </div>
                    ))}
                    {t.items.length > 2 && (
                      <div className="text-[10px] text-[#8c7b6d] italic">
                        +{t.items.length - 2} more item(s)...
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 border-t border-[#2d221b] pt-2.5">
                  <button
                    onClick={() => onOpenDetails(t)}
                    className="rounded-lg bg-[#241a12] py-1 text-center text-xs text-[#c9b8ad] hover:text-white"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onOpenPriority(t)}
                    className="rounded-lg bg-[#241a12] py-1 text-center text-xs text-[#c9b8ad] hover:text-white"
                  >
                    Priority
                  </button>
                  <button
                    onClick={() => onOpenDelay(t)}
                    className="rounded-lg bg-[#241a12] py-1 text-center text-xs text-[#c9b8ad] hover:text-white"
                  >
                    Delay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import type { KitchenTicket } from '../../data/mockRestaurantData';
import {
  CheckCircleIcon,
  ClockIcon,
  RotateCcwIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from '../Icons';

interface KitchenHistoryViewProps {
  completedTickets: KitchenTicket[];
  onRecallTicket: (ticketId: string) => void;
  onOpenDetails: (ticket: KitchenTicket) => void;
}

export const KitchenHistoryView: React.FC<KitchenHistoryViewProps> = ({
  completedTickets,
  onRecallTicket,
  onOpenDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'dine-in' | 'home-delivery'>('all');

  const filteredTickets = completedTickets.filter((t) => {
    const matchesQuery =
      t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.tableNumber && t.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.serverName && t.serverName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || t.orderType === filterType;

    return matchesQuery && matchesType;
  });

  const totalCompleted = completedTickets.length;
  const onTimeCount = completedTickets.filter((t) => {
    const targetMins = t.estimatedTimeMinutes || t.targetMinutes || 15;
    return (t.actualPrepTimeMinutes || t.elapsedMinutes) <= targetMins;
  }).length;
  const onTimeRate = totalCompleted > 0 ? Math.round((onTimeCount / totalCompleted) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#2d221b] bg-[#140f0c] p-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-serif font-bold text-amber-100">
              Completed Orders & Kitchen Shift History
            </h2>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold text-emerald-300">
              {totalCompleted} Cleared Today
            </span>
          </div>
          <p className="text-xs text-[#b8a69b] mt-1">
            Historical shift pass archive, target execution metrics, and ticket recall management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#2d221b] bg-[#19110d] px-4 py-2 text-center">
            <div className="text-xs text-[#8f7e73]">Shift Speed Metric</div>
            <div className="text-sm font-serif font-bold text-emerald-400">
              {onTimeRate}% On Time
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#2d221b] bg-[#140f0c] p-3 text-xs">
        <div className="relative w-full sm:w-80">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6a5f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, table #, or server..."
            className="w-full rounded-xl border border-[#2d221b] bg-[#140f0c] pl-8 pr-3 py-2 text-xs text-amber-100 placeholder-[#7a6a5f] focus:border-amber-500/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                : 'text-[#8f7e73] hover:text-[#c9b8ad]'
            }`}
          >
            All Cleared
          </button>
          <button
            onClick={() => setFilterType('dine-in')}
            className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
              filterType === 'dine-in'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                : 'text-[#8f7e73] hover:text-[#c9b8ad]'
            }`}
          >
            Dine-In
          </button>
          <button
            onClick={() => setFilterType('home-delivery')}
            className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
              filterType === 'home-delivery'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                : 'text-[#8f7e73] hover:text-[#c9b8ad]'
            }`}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* Ticket List */}
      {filteredTickets.length === 0 ? (
        <div className="rounded-2xl border border-[#2d221b] bg-[#140f0c] p-12 text-center text-[#8f7e73] space-y-2">
          <CheckCircleIcon size={32} className="mx-auto text-amber-500/40" />
          <p className="text-sm font-serif font-bold text-amber-100">No completed orders found</p>
          <p className="text-xs">Adjust search query or complete active cooking tickets to populate history.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => {
            const targetMins = ticket.estimatedTimeMinutes || ticket.targetMinutes || 15;
            const prepTime = ticket.actualPrepTimeMinutes || ticket.elapsedMinutes;
            const isOnTime = prepTime <= targetMins;

            return (
              <div
                key={ticket.id}
                className="flex flex-col justify-between rounded-2xl border border-[#2d221b] bg-[#140f0c] p-5 hover:border-[#4d3a2e] transition-all"
              >
                <div>
                  {/* Top line */}
                  <div className="flex items-start justify-between border-b border-[#241a14] pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-amber-300">
                          #{ticket.orderNumber}
                        </span>
                        {ticket.orderType === 'home-delivery' ? (
                          <span className="flex items-center gap-1 rounded bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                            <ShoppingBagIcon size={11} /> Delivery
                          </span>
                        ) : (
                          <span className="rounded bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                            Table {ticket.tableNumber}
                          </span>
                        )}
                        <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                          Expedited
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8f7e73] mt-1">
                        <span>Completed: {ticket.completedAt || 'Recently'}</span>
                        {ticket.serverName && (
                          <span className="flex items-center gap-1">
                            <UserIcon size={11} /> {ticket.serverName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Prep time badge */}
                    <div className="flex flex-col items-end">
                      <div
                        className={`flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-xs font-bold border ${
                          isOnTime
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : 'bg-red-950/40 border-red-500/40 text-red-300'
                        }`}
                      >
                        <ClockIcon size={12} />
                        <span>{prepTime}m ({targetMins}m target)</span>
                      </div>
                      <span className="text-[10px] text-[#7a6a5f] mt-0.5">
                        {isOnTime ? 'Met target pace' : `+${prepTime - targetMins}m over`}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-1.5 mb-4">
                    {ticket.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs text-[#c9b8ad] bg-[#19120e] rounded-lg px-2.5 py-1.5"
                      >
                        <span className="font-medium">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#7a6a5f]">
                          {item.station}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-[#241a14] pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenDetails(ticket)}
                    className="flex-1 rounded-xl border border-[#3d2f26] bg-[#1a1410] py-2 text-xs font-semibold text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200 transition-all text-center"
                  >
                    View Ticket Slip
                  </button>
                  <button
                    onClick={() => onRecallTicket(ticket.id)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all"
                    title="Recall order back to active cooking line for re-plate or sauce correction"
                  >
                    <RotateCcwIcon size={13} />
                    Recall to Line
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

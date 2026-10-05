import React, { useState } from 'react';
import type { KitchenItem, KitchenTicket } from '../../data/mockRestaurantData';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChefHatIcon,
  ClockIcon,
  EyeIcon,
  FlameIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
  StarIcon,
  TimerIcon,
} from '../Icons';

interface OrderPreparationViewProps {
  tickets: KitchenTicket[];
  onToggleItemDone: (ticketId: string, itemId: string) => void;
  onAdvanceTicketStatus: (ticketId: string) => void;
  onOpenDetails: (ticket: KitchenTicket) => void;
  onOpenPriority: (ticket: KitchenTicket) => void;
  onOpenDelay: (ticket: KitchenTicket) => void;
}

export const OrderPreparationView: React.FC<OrderPreparationViewProps> = ({
  tickets,
  onToggleItemDone,
  onAdvanceTicketStatus,
  onOpenDetails,
  onOpenPriority,
  onOpenDelay,
}) => {
  const [filterStation, setFilterStation] = useState<string>('all');
  const [filterOrderType, setFilterOrderType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Active cooking tickets are queued, preparing, or ready
  const activeTickets = tickets.filter((t) => t.status !== 'completed');

  const filteredTickets = activeTickets.filter((t) => {
    if (filterOrderType !== 'all' && t.orderType !== filterOrderType && (filterOrderType === 'home-delivery' ? t.orderType !== 'delivery' : true)) return false;
    if (filterPriority === 'rush' && (t.priority !== 'rush' && t.priority !== 'vip' && t.priority !== 'urgent' && t.priority !== 'recook')) return false;
    if (filterStation !== 'all') {
      const hasStationItem = t.items.some((item) => item.station === filterStation);
      if (!hasStationItem) return false;
    }
    return true;
  });

  const preparingCount = activeTickets.filter((t) => t.status === 'preparing' || t.status === 'cooking').length;
  const readyCount = activeTickets.filter((t) => t.status === 'ready').length;
  const overdueCount = activeTickets.filter((t) => t.isDelayed || t.elapsedMinutes > (t.estimatedTimeMinutes || t.targetMinutes || 15)).length;

  // All individual dishes currently in "Ready to Serve" stage across all active tickets
  const allReadyDishes = activeTickets.flatMap((t) =>
    t.items
      .filter((item) => (item.isCompleted ?? item.completed) || item.status === 'ready')
      .map((item) => ({ item, ticket: t }))
  );

  return (
    <div className="space-y-6">
      {/* Top Filter & Metric Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-[#2d221b] bg-[#140f0c] p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-serif font-bold text-amber-100">
              Order Preparation & Pass Management
            </h2>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-xs font-bold text-amber-300">
              {activeTickets.length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-[#b8a69b] mt-1">
            Live line cooking, course coordination, elapsed timers and expedite pass control
          </p>
        </div>

        {/* Quick telemetry badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-xs text-amber-200">
            <ChefHatIcon size={14} className="text-amber-400" />
            <span>Cooking: <strong>{preparingCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-xs text-emerald-200">
            <CheckCircleIcon size={14} className="text-emerald-400" />
            <span>Pass Ready: <strong>{readyCount} Orders</strong> ({allReadyDishes.length} Dishes)</span>
          </div>
          {overdueCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-xs text-red-200 animate-pulse">
              <ClockIcon size={14} className="text-red-400" />
              <span>Overdue / At Risk: <strong>{overdueCount}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2d221b] bg-[#140f0c] p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#8f7e73] font-semibold uppercase tracking-wider text-[10px]">Station:</span>
          {['all', 'grill', 'saute', 'pasta', 'cold', 'pastry'].map((stn) => (
            <button
              key={stn}
              onClick={() => setFilterStation(stn)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                filterStation === stn
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                  : 'text-[#8f7e73] hover:text-[#c9b8ad]'
              }`}
            >
              {stn}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOrderType(filterOrderType === 'all' ? 'dine-in' : filterOrderType === 'dine-in' ? 'home-delivery' : 'all')}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              filterOrderType !== 'all'
                ? 'border-amber-500/40 bg-amber-500/20 text-amber-200'
                : 'border-[#2d221b] bg-[#19120e] text-[#8f7e73] hover:text-[#c9b8ad]'
            }`}
          >
            {filterOrderType === 'all' ? 'All Types' : filterOrderType === 'dine-in' ? 'Dine-In Only' : 'Delivery Only'}
          </button>
          <button
            onClick={() => setFilterPriority(filterPriority === 'all' ? 'rush' : 'all')}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              filterPriority === 'rush'
                ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                : 'border-[#2d221b] bg-[#19120e] text-[#8f7e73] hover:text-[#c9b8ad]'
            }`}
          >
            <FlameIcon size={12} />
            VIP & Urgent Only
          </button>
        </div>
      </div>

      {/* Live Pass Rail - Ready to Serve Dishes across kitchen */}
      {allReadyDishes.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-[#101b13] via-[#142318] to-[#0d1610] p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <CheckCircleIcon size={15} className="text-emerald-400" />
                Live Pass Rail — Ready to Serve Dishes ({allReadyDishes.length})
              </h3>
            </div>
            <span className="text-[11px] text-emerald-400/80 font-medium hidden sm:inline">
              Plated & Garnished under Pass Heat Lamps
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {allReadyDishes.map(({ item, ticket }) => {
              const isDelivery = ticket.orderType === 'home-delivery' || ticket.orderType === 'delivery';
              return (
                <div
                  key={`pass-${ticket.id}-${item.id}`}
                  className="flex items-start justify-between rounded-xl border border-emerald-500/30 bg-[#16251b]/90 p-3 shadow-md"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-emerald-100 truncate">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-extrabold uppercase text-emerald-300 border border-emerald-500/40">
                        Ready
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 mt-1 font-mono flex-wrap">
                      <span className="text-amber-300 font-bold">#{ticket.orderNumber}</span>
                      <span>•</span>
                      <span>{isDelivery ? 'Delivery' : `Table ${ticket.tableNumber}`}</span>
                      <span>•</span>
                      <span className="uppercase font-bold">{item.station}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleItemDone(ticket.id, item.id)}
                    className="p-1 rounded text-[#8c9f91] hover:text-amber-300 hover:bg-black/30 transition-colors shrink-0"
                    title="Recall dish back to cooking checklist"
                  >
                    <RotateCcwIcon size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ticket Cards Grid */}
      {filteredTickets.length === 0 ? (
        <div className="rounded-2xl border border-[#2d221b] bg-[#140f0c] p-12 text-center text-[#8f7e73]">
          <ChefHatIcon size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm font-serif font-bold text-amber-100">No matching tickets</p>
          <p className="text-xs">Adjust filters above to display kitchen orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.map((ticket) => {
            const targetMins = ticket.estimatedTimeMinutes || ticket.targetMinutes || 15;
            const isOverdue = ticket.isDelayed || ticket.elapsedMinutes > targetMins;
            const isVIP = ticket.priority === 'rush' || ticket.priority === 'vip';
            const isUrgent = ticket.priority === 'urgent' || ticket.priority === 'recook';
            const isQueued = ticket.status === 'queued';
            const ticketAllergies = ticket.allergies || ticket.allergyAlerts;
            const hasAllergies = ticketAllergies && ticketAllergies.length > 0;
            const isHomeDelivery = ticket.orderType === 'home-delivery' || ticket.orderType === 'delivery';
            const orderTime = ticket.receivedAt || ticket.placedAt;
            const orderCourse = ticket.course || ticket.courseStage;

            // Separate items into Pending Preparation vs Ready to Serve
            const isItemReady = (item: KitchenItem) =>
              item.status === 'ready' || item.isCompleted === true || item.completed === true;

            const pendingItems = ticket.items.filter((i) => !isItemReady(i));
            const readyItems = ticket.items.filter((i) => isItemReady(i));

            const allItemsCompleted = ticket.items.length > 0 && pendingItems.length === 0;
            const isReady = ticket.status === 'ready' || allItemsCompleted;

            return (
              <div
                key={ticket.id}
                className={`h-full flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all overflow-visible ${
                  isReady
                    ? 'border-emerald-500/60 bg-gradient-to-b from-[#142318] to-[#0d1610] shadow-xl shadow-emerald-950/40'
                    : isUrgent
                    ? 'kds-priority-urgent border-red-500/50 bg-[#160a0a]'
                    : isVIP
                    ? 'kds-priority-vip border-amber-500/50 bg-[#171109]'
                    : isOverdue
                    ? 'border-red-500/40 bg-[#180f0c]'
                    : 'border-[#2d221b] bg-[#140f0c] hover:border-[#4d3a2e]'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-[#241a14] pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-base font-bold text-amber-300">
                          #{ticket.orderNumber}
                        </span>
                        {isHomeDelivery ? (
                          <span className="flex items-center gap-1 rounded bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                            <ShoppingBagIcon size={11} /> Delivery
                          </span>
                        ) : (
                          <span className="rounded bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                            Table {ticket.tableNumber}
                          </span>
                        )}
                        {isReady ? (
                          <span className="flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/60 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 animate-pulse">
                            <CheckCircleIcon size={11} /> READY FOR PASS
                          </span>
                        ) : (isVIP || isUrgent) ? (
                          <span
                            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isUrgent
                                ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                            }`}
                          >
                            <FlameIcon size={10} /> {isUrgent ? 'Re-cook' : 'VIP Rush'}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8f7e73] mt-1">
                        <span>Recv: {orderTime}</span>
                        {orderCourse && (
                          <span className="rounded bg-[#251b14] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-300/90">
                            {orderCourse}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timer Status */}
                    <div className="flex flex-col items-end">
                      <div
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs font-bold border ${
                          isOverdue
                            ? 'bg-red-950/40 border-red-500/50 text-red-300 animate-pulse'
                            : isReady
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                            : 'bg-[#1e1510] border-[#3d2f26] text-amber-200'
                        }`}
                      >
                        <TimerIcon size={13} />
                        <span>{ticket.elapsedMinutes}m / {targetMins}m</span>
                      </div>
                      {isOverdue && (
                        <span className="text-[10px] font-semibold text-red-400 mt-0.5">
                          Delayed (+{ticket.elapsedMinutes - targetMins}m)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Allergy Alert */}
                  {hasAllergies && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-500/50 px-3 py-1.5 mb-3 text-red-200 text-xs font-semibold">
                      <AlertTriangleIcon size={14} className="text-red-400 shrink-0" />
                      <span>Allergens: {ticketAllergies?.join(', ')}</span>
                    </div>
                  )}

                  {/* Special note */}
                  {ticket.specialInstructions && (
                    <div className="rounded-xl bg-[#1c140f] border border-amber-500/20 p-2.5 mb-3 text-xs text-amber-100/90 italic">
                      "{ticket.specialInstructions}"
                    </div>
                  )}

                  {/* 1. Items Cook Checklist (Pending Preparation) */}
                  <div className="space-y-2 mb-4 overflow-visible">
                    <div className="flex items-center justify-between text-[11px] text-[#8f7e73] px-1">
                      <span className="font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-1.5">
                        <FlameIcon size={12} className="text-amber-400" />
                        Items Cook Checklist ({pendingItems.length} Pending):
                      </span>
                      <span className="font-mono text-amber-300 font-semibold">
                        {readyItems.length}/{ticket.items.length} Ready
                      </span>
                    </div>

                    {pendingItems.length === 0 ? (
                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                          <CheckCircleIcon size={15} className="text-emerald-400 shrink-0" />
                          <span>All items cooked & moved to Ready to Serve / Pass!</span>
                        </div>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                          Ready
                        </span>
                      </div>
                    ) : (
                      <div className="kds-checklist-container kds-checklist-scroll">
                        {pendingItems.map((item) => {
                          const itemNotes = item.notes || item.specialNotes;

                          return (
                            <div
                              key={item.id}
                              onClick={() => onToggleItemDone(ticket.id, item.id)}
                              className="group flex items-start justify-between rounded-xl border border-[#2d221b] bg-[#18110d] p-3 transition-all cursor-pointer hover:border-amber-500/50 hover:bg-[#20150f] active:scale-[0.99]"
                              title="Click or check box to mark dish READY"
                            >
                              <div className="flex items-start gap-2.5 min-w-0 pr-2">
                                <input
                                  type="checkbox"
                                  checked={false}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    onToggleItemDone(ticket.id, item.id);
                                  }}
                                  className="mt-0.5 h-4 w-4 rounded accent-emerald-500 cursor-pointer shrink-0"
                                  title="Mark dish READY"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs text-amber-100">
                                      {item.quantity}x {item.name}
                                    </span>
                                  </div>
                                  {item.portion && (
                                    <span className="text-[10px] text-[#8c7b6d] font-mono block">
                                      Portion: {item.portion}
                                    </span>
                                  )}
                                  {itemNotes && (
                                    <p className="text-[11px] text-amber-300/80 italic mt-0.5">
                                      • {itemNotes}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    item.station === 'grill'
                                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                                      : item.station === 'saute'
                                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                      : item.station === 'pasta'
                                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                                      : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                                  }`}
                                >
                                  {item.station}
                                </span>
                                <span className="text-[10px] font-bold text-amber-400/80 group-hover:text-emerald-400 transition-colors">
                                  Mark Ready →
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. Ready to Serve / Expedite Pass Section */}
                  <div className="space-y-2 mb-4 pt-2 border-t border-[#241a14]/80 overflow-visible">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400/90 px-1">
                      <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircleIcon size={13} className="text-emerald-400" />
                        Ready to Serve / Expedite Pass ({readyItems.length} Ready):
                      </span>
                      <span className="text-[10px] text-emerald-500/80 font-medium">
                        Pass Ready
                      </span>
                    </div>

                    {readyItems.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#2d221b] bg-[#120d0a]/60 p-3 text-center text-xs text-[#7a6a5f]">
                        No dishes ready yet. Check items above to plate them here.
                      </div>
                    ) : (
                      <div className="kds-checklist-container kds-checklist-scroll">
                        {readyItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between rounded-xl border border-emerald-500/40 bg-gradient-to-r from-[#122016] to-[#0f1712] p-2.5 transition-all shadow-md"
                          >
                            <div className="flex items-start gap-2.5 min-w-0 pr-2">
                              <input
                                type="checkbox"
                                checked={true}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  onToggleItemDone(ticket.id, item.id);
                                }}
                                className="mt-0.5 h-4 w-4 rounded accent-emerald-500 cursor-pointer shrink-0"
                                title="Click to recall dish back to checklist"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs text-emerald-100">
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 border border-emerald-500/40">
                                    READY
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-emerald-400/80 mt-0.5 font-mono flex-wrap">
                                  <span className="text-amber-300 font-bold">#{ticket.orderNumber}</span>
                                  <span>•</span>
                                  <span>{isHomeDelivery ? 'Delivery' : `Table ${ticket.tableNumber}`}</span>
                                  <span>•</span>
                                  <span className="uppercase font-bold">{item.station} station</span>
                                </div>
                                {item.portion && (
                                  <span className="text-[10px] text-[#8c9f91] font-mono block mt-0.5">
                                    Portion: {item.portion}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0 ml-1">
                              <button
                                type="button"
                                onClick={() => onToggleItemDone(ticket.id, item.id)}
                                className="text-[10px] text-[#8c9f91] hover:text-amber-300 transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#2d3d30] bg-[#101b13]"
                                title="Recall dish back to cooking checklist"
                              >
                                <RotateCcwIcon size={10} />
                                <span>Recall</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="border-t border-[#241a14] pt-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onOpenDetails(ticket)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-[#3d2f26] bg-[#1a1410] py-1.5 text-xs text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200"
                    >
                      <EyeIcon size={12} /> Details
                    </button>
                    <button
                      onClick={() => onOpenPriority(ticket)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-[#3d2f26] bg-[#1a1410] py-1.5 text-xs text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200"
                    >
                      <StarIcon size={12} /> Priority
                    </button>
                    <button
                      onClick={() => onOpenDelay(ticket)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-[#3d2f26] bg-[#1a1410] py-1.5 text-xs text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200"
                    >
                      <ClockIcon size={12} /> Delay
                    </button>
                  </div>

                  {/* Primary Advance Button */}
                  {isReady ? (
                    <button
                      onClick={() => onAdvanceTicketStatus(ticket.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/60 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <CheckCircleIcon size={14} />
                      Advance to Pass
                    </button>
                  ) : isQueued ? (
                    <button
                      onClick={() => onAdvanceTicketStatus(ticket.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-2.5 text-xs font-bold text-[#0c0805] shadow-lg shadow-amber-900/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <ChefHatIcon size={14} /> Start Cooking Line
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1c140f] border border-[#34271c] py-2.5 text-xs font-bold text-[#8c7b6d] opacity-60 cursor-not-allowed"
                      title="Mark all items ready to enable Advance to Pass"
                    >
                      <FlameIcon size={14} className="text-amber-500/50" />
                      Advance to Pass ({readyItems.length}/{ticket.items.length} Ready)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

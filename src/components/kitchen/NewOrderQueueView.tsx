import React from 'react';
import type { KitchenTicket } from '../../data/mockRestaurantData';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  FlameIcon,
  ShoppingBagIcon,
  StarIcon,
  UserIcon,
} from '../Icons';

interface NewOrderQueueViewProps {
  tickets: KitchenTicket[];
  onAcceptOrder: (ticketId: string) => void;
  onOpenDetails: (ticket: KitchenTicket) => void;
  onOpenPriority: (ticket: KitchenTicket) => void;
  onOpenDelay: (ticket: KitchenTicket) => void;
}

export const NewOrderQueueView: React.FC<NewOrderQueueViewProps> = ({
  tickets,
  onAcceptOrder,
  onOpenDetails,
  onOpenPriority,
  onOpenDelay,
}) => {
  const newTickets = tickets.filter((t) => t.status === 'queued');

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#2d221b] bg-[#140f0c] p-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-serif font-bold text-amber-100">
              New Order Queue
            </h2>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-xs font-bold text-amber-300">
              {newTickets.length} Incoming Tickets
            </span>
          </div>
          <p className="text-xs text-[#b8a69b] mt-1">
            Real-time queue awaiting Chef de Cuisine acceptance and station fire dispatch
          </p>
        </div>

        {newTickets.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                newTickets.forEach((t) => onAcceptOrder(t.id));
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:brightness-110 active:scale-95 transition-all"
            >
              <CheckCircleIcon size={14} />
              Accept & Fire All ({newTickets.length})
            </button>
          </div>
        )}
      </div>

      {/* Ticket Cards Grid */}
      {newTickets.length === 0 ? (
        <div className="rounded-2xl border border-[#2d221b] bg-[#140f0c] p-12 text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e1713] text-[#7a6a5f]">
            <CheckCircleIcon size={32} />
          </div>
          <h3 className="text-base font-serif font-bold text-amber-200">
            Queue is Clear
          </h3>
          <p className="text-xs text-[#8f7e73] max-w-sm mx-auto">
            All received orders have been accepted and dispatched to active kitchen cooking lines.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {newTickets.map((ticket) => {
            const ticketAllergies = ticket.allergies || ticket.allergyAlerts;
            const hasAllergies = ticketAllergies && ticketAllergies.length > 0;
            const isVIP = ticket.priority === 'rush' || ticket.priority === 'vip';
            const isUrgent = ticket.priority === 'urgent' || ticket.priority === 'recook';
            const isHomeDelivery = ticket.orderType === 'home-delivery' || ticket.orderType === 'delivery';
            const orderTime = ticket.receivedAt || ticket.placedAt;
            const targetMins = ticket.estimatedTimeMinutes || ticket.targetMinutes || 15;

            return (
              <div
                key={ticket.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isUrgent
                    ? 'kds-priority-urgent border-red-500/50 bg-[#160a0a]'
                    : isVIP
                    ? 'kds-priority-vip border-amber-500/50 bg-[#171109]'
                    : 'border-[#2d221b] bg-[#140f0c] hover:border-[#4d3a2e]'
                }`}
              >
                <div>
                  {/* Top Bar of card */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#241a14] pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
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
                        {(isVIP || isUrgent) && (
                          <span
                            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isUrgent
                                ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                            }`}
                          >
                            <FlameIcon size={10} /> {isUrgent ? 'Re-cook' : 'VIP Rush'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#8f7e73] mt-1">
                        <span>Recv: {orderTime}</span>
                        {ticket.serverName && (
                          <span className="flex items-center gap-1">
                            <UserIcon size={11} /> {ticket.serverName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Target timer badge */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-200 bg-[#1d1510] border border-[#3d2f26] px-2 py-1 rounded-lg">
                        <ClockIcon size={12} className="text-amber-400" />
                        <span>{targetMins} min target</span>
                      </div>
                      <span className="text-[10px] text-[#7a6a5f] mt-0.5">
                        {ticket.elapsedMinutes}m elapsed
                      </span>
                    </div>
                  </div>

                  {/* Allergy Alert Pill */}
                  {hasAllergies && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-500/50 px-3 py-1.5 mb-3 text-red-200 text-xs font-semibold">
                      <AlertTriangleIcon size={14} className="text-red-400 shrink-0" />
                      <span>Allergens: {ticketAllergies?.join(', ')}</span>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {ticket.specialInstructions && (
                    <div className="rounded-xl bg-[#1c140f] border border-amber-500/20 p-2.5 mb-3 text-xs text-amber-100/90 italic">
                      "{ticket.specialInstructions}"
                    </div>
                  )}

                  {/* Item List */}
                  <div className="space-y-2 mb-4">
                    {ticket.items.map((item) => {
                      const itemNotes = item.notes || item.specialNotes;
                      return (
                        <div
                          key={item.id}
                          className="flex items-start justify-between rounded-lg bg-[#19120e] p-2 text-xs"
                        >
                          <div className="flex items-start gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-500/20 font-mono font-bold text-amber-300 text-[11px]">
                              {item.quantity}
                            </span>
                            <div>
                              <span className="font-semibold text-amber-100">{item.name}</span>
                              {itemNotes && (
                                <p className="text-[11px] text-amber-300/80 italic mt-0.5">
                                  • {itemNotes}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#221813] text-[#8f7e73]">
                            {item.station}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="border-t border-[#241a14] pt-3 flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onOpenDetails(ticket)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-[#3d2f26] bg-[#1a1410] py-1.5 text-xs text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200"
                    >
                      <EyeIcon size={12} />
                      Details
                    </button>
                    <button
                      onClick={() => onOpenPriority(ticket)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-[#3d2f26] bg-[#1a1410] py-1.5 text-xs text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200"
                    >
                      <StarIcon size={12} />
                      Priority
                    </button>
                    <button
                      onClick={() => onOpenDelay(ticket)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-[#3d2f26] bg-[#1a1410] py-1.5 text-xs text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200"
                    >
                      <ClockIcon size={12} />
                      Delay
                    </button>
                  </div>

                  <button
                    onClick={() => onAcceptOrder(ticket.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    <CheckCircleIcon size={14} />
                    Accept Order & Fire to Line
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

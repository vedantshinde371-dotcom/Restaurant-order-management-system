import React from 'react';
import type { KitchenTicket } from '../../data/mockRestaurantData';
import {
  CheckCircleIcon,
  ChefHatIcon,
  ClockIcon,
  EyeIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
  UserIcon,
} from '../Icons';

interface ExpeditePassViewProps {
  tickets: KitchenTicket[];
  onCompleteTicket: (ticketId: string) => void;
  onRecallToPrep: (ticketId: string) => void;
  onOpenDetails: (ticket: KitchenTicket) => void;
}

export const ExpeditePassView: React.FC<ExpeditePassViewProps> = ({
  tickets,
  onCompleteTicket,
  onRecallToPrep,
  onOpenDetails,
}) => {
  const readyTickets = tickets.filter((t) => t.status === 'ready');

  return (
    <div className="space-y-6">
      {/* Top Pass Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-serif font-bold text-amber-100">
              Expedite Pass & Plated Orders
            </h2>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold text-emerald-300">
              {readyTickets.length} Orders on Pass
            </span>
          </div>
          <p className="text-xs text-[#8c7b6d] mt-1">
            Plated dishes under Chef pass heat lamps awaiting server pickup or courier handover
          </p>
        </div>

        {readyTickets.length > 0 && (
          <button
            onClick={() => readyTickets.forEach((t) => onCompleteTicket(t.id))}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <CheckCircleIcon size={15} />
            <span>Expedite All to Service ({readyTickets.length})</span>
          </button>
        )}
      </div>

      {/* Ready Tickets Grid */}
      {readyTickets.length === 0 ? (
        <div className="rounded-2xl border border-[#34271c] bg-[#140f0c] p-12 text-center text-[#8c7b6d] space-y-2">
          <ChefHatIcon size={36} className="mx-auto text-amber-500/40" />
          <h3 className="text-base font-serif font-bold text-amber-200">The Pass is Clear</h3>
          <p className="text-xs max-w-sm mx-auto">
            No completed dishes are currently resting on the expedite pass. Check the Active Cooking Line to monitor dishes nearing completion.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {readyTickets.map((ticket) => {
            const isDelivery = ticket.orderType === 'delivery' || ticket.orderType === 'home-delivery';
            const targetMins = ticket.estimatedTimeMinutes || ticket.targetMinutes || 15;

            return (
              <div
                key={ticket.id}
                className="flex flex-col justify-between rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-[#141f17] to-[#111612] p-5 shadow-xl transition-all hover:border-emerald-400"
              >
                <div>
                  {/* Top Ticket Line */}
                  <div className="flex items-start justify-between border-b border-[#243328] pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-amber-300">
                          #{ticket.orderNumber}
                        </span>
                        {isDelivery ? (
                          <span className="flex items-center gap-1 rounded bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                            <ShoppingBagIcon size={11} /> Delivery
                          </span>
                        ) : (
                          <span className="rounded bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                            Table {ticket.tableNumber}
                          </span>
                        )}
                        <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                          Pass Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8c9f91] mt-1">
                        {ticket.serverName ? (
                          <span className="flex items-center gap-1">
                            <UserIcon size={12} /> Server: <strong>{ticket.serverName}</strong>
                          </span>
                        ) : (
                          <span>Direct Courier Dispatch</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-1 rounded-lg">
                        <ClockIcon size={12} />
                        <span>{ticket.elapsedMinutes}m / {targetMins}m</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/80 mt-0.5 block">
                        Plated & Garnished
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] text-[#8c9f91] uppercase font-bold tracking-wider">
                      Plated Dishes ({ticket.items.length}):
                    </div>
                    {ticket.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg bg-[#18251c] px-3 py-2 text-xs border border-emerald-900/30"
                      >
                        <div className="flex items-center gap-2 text-emerald-100">
                          <CheckCircleIcon size={14} className="text-emerald-400" />
                          <span className="font-semibold">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase text-[#8c9f91]">
                          {item.station}
                        </span>
                      </div>
                    ))}
                  </div>

                  {ticket.specialInstructions && (
                    <div className="rounded-xl bg-[#162118] border border-emerald-500/20 p-2.5 mb-3 text-xs text-emerald-200/90 italic">
                      "{ticket.specialInstructions}"
                    </div>
                  )}
                </div>

                {/* Pass Actions */}
                <div className="border-t border-[#243328] pt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDetails(ticket)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#344639] bg-[#1a281e] py-1.5 text-xs text-[#a8bfae] hover:text-white"
                    >
                      <EyeIcon size={12} /> Slip
                    </button>
                    <button
                      onClick={() => onRecallToPrep(ticket.id)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-amber-600/40 bg-amber-950/20 py-1.5 text-xs text-amber-300 hover:bg-amber-950/40"
                    >
                      <RotateCcwIcon size={12} /> Re-fire / Re-plate
                    </button>
                  </div>

                  <button
                    onClick={() => onCompleteTicket(ticket.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    <CheckCircleIcon size={15} />
                    {isDelivery ? 'Courier Handover Complete' : 'Hand Over to Server (Expedited)'}
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

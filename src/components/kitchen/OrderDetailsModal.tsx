import React from 'react';
import './KitchenDashboard.css';
import {
  XIcon,
  ChefHatIcon,
  ClockIcon,
  AlertCircleIcon,
  PrinterIcon,
  CheckCircleIcon,
  FlameIcon,
} from '../Icons';
import { type KitchenTicket } from '../../data/mockRestaurantData';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: KitchenTicket | null;
  onAdvanceTicketStatus?: (ticketId: string) => void;
  onToggleItemComplete?: (ticketId: string, itemId: string) => void;
  onToggleItemCompletion?: (itemId: string) => void;
  onPrintKitchenSlip?: (orderNumber: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onAdvanceTicketStatus,
  onToggleItemComplete,
}) => {
  if (!isOpen || !ticket) return null;

  const isDineIn = ticket.orderType === 'dine-in';
  const isDelayed = ticket.isDelayed || ticket.elapsedMinutes > ticket.targetMinutes;

  return (
    <div className="kitchen-modal-backdrop">
      <div className="kitchen-modal-card max-w-2xl max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#34271c] bg-[#1a140f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9893d]/20 border border-[#c9893d]/40 flex items-center justify-center text-[#c9893d]">
              <ChefHatIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold tracking-wide text-[#f5ede4]">
                  Ticket #{ticket.id} ({ticket.orderNumber})
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  ticket.priority === 'vip'
                    ? 'bg-[#c9893d]/20 text-[#e5a962] border border-[#c9893d]/50'
                    : ticket.priority === 'rush' || ticket.priority === 'recook'
                    ? 'bg-rose-950/60 text-rose-400 border border-rose-700/60'
                    : 'bg-[#241a12] text-[#a89687] border border-[#34271c]'
                }`}>
                  {ticket.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <div className="text-xs text-[#8c7b6d] mt-0.5">
                <span>{isDineIn ? `Table Dining: ${ticket.tableNumber}` : `Home Delivery: ${ticket.customerName}`}</span>
                {ticket.serverName && <span> • Server: {ticket.serverName}</span>}
                <span> • Placed: {ticket.placedAt}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a89687] hover:text-[#f5ede4] hover:bg-[#241a12] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Prep Status & Timer Banner */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#1b1510] border border-[#34271c]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8c7b6d]">Current KDS Stage</span>
              <div className="font-bold text-[#f5ede4] capitalize mt-0.5 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  ticket.status === 'ready'
                    ? 'bg-emerald-400'
                    : ticket.status === 'plating'
                    ? 'bg-amber-400'
                    : 'bg-[#c9893d] animate-pulse'
                }`} />
                {ticket.status === 'ready' ? 'Plated on Pass' : ticket.status}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#8c7b6d]">Prep Time Elapsed</span>
              <div className={`font-mono font-bold text-sm mt-0.5 flex items-center gap-1 ${
                isDelayed ? 'text-rose-400' : ticket.elapsedMinutes > 12 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                <ClockIcon className="w-3.5 h-3.5" />
                <span>{ticket.elapsedMinutes}m / {ticket.targetMinutes}m</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#8c7b6d]">Course Stage</span>
              <div className="font-bold text-[#e5a962] capitalize mt-0.5">
                {ticket.courseStage} Course
              </div>
            </div>
          </div>

          {/* Severe Allergy Caution Box */}
          {ticket.allergyAlerts && ticket.allergyAlerts.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-700/60 text-rose-300">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-rose-400 mb-1">
                <AlertCircleIcon className="w-4 h-4 text-rose-400" />
                <span>ALLERGY & DIETARY PRECAUTION ALERT</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-rose-200">
                {ticket.allergyAlerts.map((allergy, i) => (
                  <li key={i} className="font-semibold">{allergy}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Special Instructions */}
          {ticket.specialInstructions && (
            <div className="p-3 rounded-xl bg-[#1b1510] border border-[#34271c]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9893d] block mb-1">
                Chef Notes / Special Requests
              </span>
              <p className="text-xs italic text-[#f5ede4]">"{ticket.specialInstructions}"</p>
            </div>
          )}

          {/* Item Breakdown */}
          <div className="space-y-4">
            {/* 1. Items Cook Checklist (Pending) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <FlameIcon className="w-3.5 h-3.5 text-amber-400" />
                  Items Cook Checklist ({ticket.items.filter((i) => !(i.status === 'ready' || i.isCompleted || i.completed)).length} Pending):
                </span>
                <span className="text-[11px] text-[#8c7b6d]">
                  Click checkbox or dish to mark READY
                </span>
              </div>

              {ticket.items.filter((i) => !(i.status === 'ready' || i.isCompleted || i.completed)).length === 0 ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3 flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    <span>All items cooked & moved to Ready to Serve / Pass!</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                    Ready
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {ticket.items
                    .filter((item) => !(item.status === 'ready' || item.isCompleted || item.completed))
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onToggleItemComplete?.(ticket.id, item.id)}
                        className="p-3 rounded-xl border border-[#34271c] bg-[#1b1510] hover:border-amber-500/50 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                        title="Click to mark dish READY"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={(e) => {
                              e.stopPropagation();
                              onToggleItemComplete?.(ticket.id, item.id);
                            }}
                            className="w-4 h-4 rounded mt-0.5 accent-emerald-500 cursor-pointer shrink-0"
                            title="Mark item READY"
                          />

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm font-bold text-[#f5ede4]">
                                {item.quantity}x {item.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase station-pill-${item.station}`}>
                                {item.station}
                              </span>
                            </div>

                            {item.portion && (
                              <div className="text-[11px] text-[#a89687] mt-0.5">
                                Portion: <span className="text-[#f5ede4] font-medium">{item.portion}</span>
                              </div>
                            )}

                            {item.customizations && item.customizations.length > 0 && (
                              <div className="text-[11px] text-[#c9893d] mt-0.5">
                                Prep: {item.customizations.join(', ')}
                              </div>
                            )}

                            {item.specialNotes && (
                              <div className="text-[11px] text-[#e5a962] italic mt-0.5">
                                Note: {item.specialNotes}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#241a12] text-amber-300 border border-[#34271c]">
                          Mark Ready →
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 2. Ready to Serve / Expedite Pass Section */}
            <div className="space-y-2 pt-2 border-t border-[#2d221b]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Ready to Serve / Expedite Pass ({ticket.items.filter((i) => i.status === 'ready' || i.isCompleted || i.completed).length} Ready):
                </span>
                <span className="text-[11px] text-emerald-500/80 font-mono">
                  #{ticket.orderNumber} • {isDineIn ? `Table ${ticket.tableNumber}` : 'Delivery'}
                </span>
              </div>

              {ticket.items.filter((i) => i.status === 'ready' || i.isCompleted || i.completed).length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#2d221b] bg-[#140f0c]/60 p-3 text-center text-xs text-[#7a6a5f]">
                  No dishes ready yet. Check items above to move them here.
                </div>
              ) : (
                <div className="space-y-2">
                  {ticket.items
                    .filter((item) => item.status === 'ready' || item.isCompleted || item.completed)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-[#122016] to-[#0f1712] flex items-start justify-between gap-3 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={(e) => {
                              e.stopPropagation();
                              onToggleItemComplete?.(ticket.id, item.id);
                            }}
                            className="w-4 h-4 rounded mt-0.5 accent-emerald-500 cursor-pointer shrink-0"
                            title="Click to recall dish back to cooking checklist"
                          />

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm font-bold text-emerald-100">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-emerald-300 border border-emerald-500/40">
                                READY
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-emerald-400/80 mt-0.5 font-mono">
                              <span className="text-amber-300 font-bold">#{ticket.orderNumber}</span>
                              <span>•</span>
                              <span>{isDineIn ? `Table ${ticket.tableNumber}` : 'Delivery'}</span>
                              <span>•</span>
                              <span className="uppercase font-bold">{item.station} station</span>
                            </div>

                            {item.portion && (
                              <div className="text-[11px] text-[#8c9f91] mt-0.5">
                                Portion: <span className="text-emerald-100 font-medium">{item.portion}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleItemComplete?.(ticket.id, item.id)}
                          className="text-[10px] text-[#8c9f91] hover:text-amber-300 transition-colors px-2 py-1 rounded border border-[#2d3d30] bg-[#101b13]"
                          title="Recall dish back to cooking checklist"
                        >
                          Recall
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#34271c] bg-[#1a140f] flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-[#241a12] hover:bg-[#2d2218] border border-[#34271c] text-xs font-semibold text-[#f5ede4] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PrinterIcon className="w-4 h-4 text-[#c9893d]" />
            <span>Print Expediter Slip</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#241a12] hover:bg-[#2d2218] border border-[#34271c] text-xs font-medium text-[#a89687] hover:text-[#f5ede4] transition-colors"
            >
              Close
            </button>

            {ticket.items.every((i) => i.status === 'ready' || i.isCompleted || i.completed) ? (
              <button
                onClick={() => {
                  onAdvanceTicketStatus?.(ticket.id);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircleIcon className="w-4 h-4" />
                <span>Advance to Pass</span>
              </button>
            ) : (
              <button
                disabled={true}
                className="px-5 py-2 rounded-xl bg-[#241a12] border border-[#34271c] text-[#8c7b6d] text-xs font-bold opacity-60 cursor-not-allowed flex items-center gap-1.5"
                title="Mark all items ready to enable Advance to Pass"
              >
                <FlameIcon className="w-4 h-4 text-amber-500/50" />
                <span>Advance to Pass ({ticket.items.filter((i) => i.status === 'ready' || i.isCompleted || i.completed).length}/{ticket.items.length} Ready)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

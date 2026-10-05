import React from 'react';
import './WaiterDashboard.css';
import { XIcon, BellRingIcon, CheckCircleIcon, ClockIcon, WineIcon, CheckCheckIcon } from '../Icons';
import { type CustomerAssistanceRequest } from '../../data/mockRestaurantData';

interface CustomerRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: CustomerAssistanceRequest[];
  onAcknowledgeRequest: (id: string) => void;
  onCompleteRequest: (id: string) => void;
}

export const CustomerRequestsModal: React.FC<CustomerRequestsModalProps> = ({
  isOpen,
  onClose,
  requests,
  onAcknowledgeRequest,
  onCompleteRequest,
}) => {
  if (!isOpen) return null;

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#16120e] border border-[#c9893d]/30 rounded-2xl shadow-2xl overflow-hidden text-[#e8dfd8] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#34271c] bg-[#1c1611]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9893d]/15 border border-[#c9893d]/30 flex items-center justify-center text-[#c9893d]">
              <BellRingIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold tracking-wide text-[#f5ede4]">
                  Guest Assistance Calls
                </h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/40 font-bold animate-pulse">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a89687]">
                Live table buzzers, refill requests, and sommelier consultations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Requests List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {requests.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#8c7b6d] bg-[#1a140f] rounded-xl border border-dashed border-[#34271c]">
              <CheckCircleIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              All customer requests attended! The dining floor is calm.
            </div>
          ) : (
            requests.map((req) => {
              const isPending = req.status === 'pending';
              const isInProgress = req.status === 'in_progress';
              const isCompleted = req.status === 'completed';

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isPending
                      ? 'bg-[#1e150f] border-rose-500/40 shadow-lg shadow-rose-950/20'
                      : isInProgress
                      ? 'bg-[#1b1510] border-[#c9893d]/50'
                      : 'bg-[#14100c] border-[#2d2218] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          req.requestType === 'request_bill' || req.type === 'bill'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : req.requestType === 'sommelier' || req.type === 'sommelier'
                            ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                            : isPending
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                            : 'bg-[#291e15] text-[#c9893d]'
                        }`}
                      >
                        {req.requestType === 'sommelier' || req.type === 'sommelier' ? (
                          <WineIcon className="w-4 h-4" />
                        ) : (
                          <BellRingIcon className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#f5ede4]">
                            {req.tableNumber}
                          </span>
                          {req.zone && <span className="text-xs text-[#a89687]">({req.zone})</span>}
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              req.urgency === 'urgent' || req.urgency === 'high'
                                ? 'bg-rose-900/60 text-rose-300 border border-rose-700/40'
                                : 'bg-[#2c2016] text-[#b8a698]'
                            }`}
                          >
                            {req.urgency} priority
                          </span>
                        </div>

                        <p className="text-xs text-[#f0e6dd] mt-1 font-medium">{req.details}</p>

                        <div className="flex items-center gap-3 text-[11px] text-[#8c7b6d] mt-2">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3 text-[#c9893d]" />
                            {req.timeAgo || req.time}
                          </span>
                          <span>•</span>
                          <span>Assigned: {req.assignedServer || 'Marco Valenti'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <button
                          onClick={() => onAcknowledgeRequest(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#c9893d]/20 border border-[#c9893d]/40 text-[#f5ede4] hover:bg-[#c9893d] hover:text-[#140f0c] text-xs font-semibold transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => onCompleteRequest(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-600 hover:text-emerald-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <CheckCheckIcon className="w-3.5 h-3.5" />
                          Resolve
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircleIcon className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#34271c] bg-[#1a140e] flex items-center justify-between text-xs text-[#a89687]">
          <span>Buzzers auto-sync with guest mobile dining view</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#34271c] text-xs font-medium text-[#e8dfd8] hover:bg-[#251e17] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

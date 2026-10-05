import React, { useState } from 'react';
import './KitchenDashboard.css';
import {
  XIcon,
  AlertCircleIcon,
  TimerIcon,
  CheckCircleIcon,
} from '../Icons';
import { type KitchenTicket } from '../../data/mockRestaurantData';

interface DelayAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: KitchenTicket | null;
  onFlagDelay?: (ticketId: string, additionalMinutes: number, reason: string) => void;
  onClearDelay?: (ticketId: string) => void;
  onBroadcastDelay?: (ticketId: string, extraMinutes: number, reason: string, notifyFloor: boolean) => void;
}

const DELAY_PRESETS = [
  { label: 'Tomahawk / Bone-In Thermal Rest', minutes: 5 },
  { label: 'Special Well-Done Temperature Prep', minutes: 8 },
  { label: 'Reduction Glaze / Fresh Sauce Simmer', minutes: 4 },
  { label: 'High Ticket Bottleneck on Grill Line', minutes: 7 },
  { label: 'Fresh Prep Restock from Walk-in Larder', minutes: 6 },
];

export const DelayAlertModal: React.FC<DelayAlertModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onFlagDelay,
  onClearDelay,
  onBroadcastDelay,
}) => {
  const [extraMinutes, setExtraMinutes] = useState<number>(5);
  const [reason, setReason] = useState<string>(DELAY_PRESETS[0].label);

  if (!isOpen || !ticket) return null;

  const currentElapsed = ticket.elapsedMinutes;
  const target = ticket.estimatedTimeMinutes || ticket.targetMinutes || 15;

  const handleConfirmFlag = () => {
    if (onBroadcastDelay) {
      onBroadcastDelay(ticket.id, extraMinutes, reason, true);
    }
    if (onFlagDelay) {
      onFlagDelay(ticket.id, extraMinutes, reason);
    }
    onClose();
  };

  const handleResolve = () => {
    if (onClearDelay) {
      onClearDelay(ticket.id);
    }
    onClose();
  };

  return (
    <div className="kitchen-modal-backdrop">
      <div className="kitchen-modal-card max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#34271c] bg-[#1a140f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <TimerIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-wide text-[#f5ede4]">
                Preparation Delay Management
              </h3>
              <p className="text-xs text-[#a89687]">
                Flag prep delay for Ticket #{ticket.id} ({ticket.tableNumber || ticket.orderNumber})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a89687] hover:text-[#f5ede4] hover:bg-[#241a12] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Status comparison bar */}
          <div className="p-3.5 rounded-xl bg-[#1b1510] border border-[#34271c] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8c7b6d]">Current Target Time</span>
              <div className="font-bold text-[#f5ede4] text-sm mt-0.5">{target} Minutes</div>
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-[#8c7b6d]">Elapsed Time</span>
              <div className={`font-bold font-mono text-sm mt-0.5 ${
                currentElapsed > target ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {currentElapsed}m elapsed
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#8c7b6d]">Est. New Target</span>
              <div className="font-bold text-[#e5a962] text-sm mt-0.5">
                {target + extraMinutes} Minutes
              </div>
            </div>
          </div>

          {/* Additional Minutes Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#c9893d] mb-2">
              Extend Target Prep Window
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[3, 5, 8, 10, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setExtraMinutes(mins)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    extraMinutes === mins
                      ? 'bg-[#c9893d] text-[#140f0c] border-[#c9893d] shadow'
                      : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                  }`}
                >
                  +{mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Preset Reasons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#c9893d] mb-1.5">
              Select Delay Cause (Logged for Expediter & Floor Server)
            </label>
            <div className="space-y-1.5">
              {DELAY_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setReason(preset.label);
                    setExtraMinutes(preset.minutes);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                    reason === preset.label
                      ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4]'
                      : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] font-mono text-[#c9893d]">+{preset.minutes}m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom reason input */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8c7b6d] mb-1">
              Custom Kitchen Delay Explanation
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Line restock, re-plating dish..."
              className="w-full bg-[#1b1510] text-xs px-3.5 py-2.5 rounded-xl border border-[#34271c] text-[#f5ede4] outline-none placeholder-[#6d5b4e]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#34271c] bg-[#1a140f] flex items-center justify-between gap-3">
          {ticket.isDelayed ? (
            <button
              onClick={handleResolve}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              <span>Resolve Delay (On Track)</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#241a12] hover:bg-[#2d2218] border border-[#34271c] text-xs font-medium text-[#a89687] hover:text-[#f5ede4] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmFlag}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-[#140f0c] text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <AlertCircleIcon className="w-4 h-4" />
              <span>Broadcast Delay Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

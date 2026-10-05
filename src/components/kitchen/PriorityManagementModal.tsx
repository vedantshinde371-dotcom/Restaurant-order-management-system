import React, { useState } from 'react';
import type { KitchenPriority, KitchenTicket } from '../../data/mockRestaurantData';
import { AlertTriangleIcon, CheckCircleIcon, FlameIcon, StarIcon, XIcon } from '../Icons';

interface PriorityManagementModalProps {
  ticket: KitchenTicket;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePriority: (ticketId: string, priority: KitchenPriority, bumpToTop: boolean, reason: string) => void;
}

export const PriorityManagementModal: React.FC<PriorityManagementModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdatePriority,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<KitchenPriority>(ticket.priority);
  const [bumpToTop, setBumpToTop] = useState<boolean>(
    ticket.priority === 'urgent' || ticket.priority === 'recook' || ticket.priority === 'rush' || ticket.priority === 'vip'
  );
  const [reason, setReason] = useState<string>('');

  if (!isOpen) return null;

  const priorityOptions: Array<{
    id: KitchenPriority;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    colorClass: string;
  }> = [
    {
      id: 'urgent',
      label: 'Urgent / Re-cook',
      sublabel: 'Immediate station priority • Customer recook or dropped dish',
      icon: <FlameIcon size={18} className="text-red-400" />,
      colorClass: 'border-red-500/40 bg-red-950/20 text-red-200',
    },
    {
      id: 'rush',
      label: 'VIP / Rush Order',
      sublabel: 'Prominent highlight • Fast-track across all line stations',
      icon: <StarIcon size={18} className="text-amber-400" />,
      colorClass: 'border-amber-500/40 bg-amber-950/20 text-amber-200',
    },
    {
      id: 'normal',
      label: 'Standard Pace',
      sublabel: 'Normal FIFO kitchen queuing • Follows target ticket duration',
      icon: <CheckCircleIcon size={18} className="text-emerald-400" />,
      colorClass: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
    },
    {
      id: 'low',
      label: 'Hold / Low Priority',
      sublabel: 'Guest requested later fire or awaiting companion party',
      icon: <AlertTriangleIcon size={18} className="text-blue-400" />,
      colorClass: 'border-blue-500/40 bg-blue-950/20 text-blue-200',
    },
  ];

  const presetReasons = [
    'VIP Guest / Chef Tasting Request',
    'Customer Re-cook / Dish Replacement',
    'Delivery Courier Already Arrived at Host Stand',
    'Guest Delayed at Bar — Hold Fire',
    'Course Staggering Adjustment',
  ];

  const handleApply = () => {
    onUpdatePriority(ticket.id, selectedPriority, bumpToTop, reason || 'Chef re-prioritization');
    onClose();
  };

  return (
    <div className="kds-modal-overlay">
      <div className="kds-modal-card max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2d221b] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <StarIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">
                Order Priority Management
              </h2>
              <p className="text-xs text-[#b8a69b]">
                Adjust fire priority & station sequence for{' '}
                <span className="font-semibold text-amber-300">Ticket #{ticket.orderNumber}</span> ({ticket.orderType === 'dine-in' ? `Table ${ticket.tableNumber}` : 'Home Delivery'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#1a1410] text-[#a89689] hover:text-white"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Priority Levels */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
              Select Kitchen Priority Level
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {priorityOptions.map((opt) => {
                const isSelected = selectedPriority === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedPriority(opt.id);
                      if (opt.id === 'urgent' || opt.id === 'recook' || opt.id === 'rush' || opt.id === 'vip') {
                        setBumpToTop(true);
                      }
                    }}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? `${opt.colorClass} shadow-lg ring-1 ring-amber-400/50`
                        : 'border-[#2d221b] bg-[#140f0c] text-[#c9b8ad] hover:border-[#4d3a2e]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 font-medium text-sm">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[11px] leading-relaxed text-[#9f8d81]">
                      {opt.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bump to Top Checkbox */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#2d221b] bg-[#140f0c]">
            <div>
              <span className="text-sm font-medium text-amber-100">Bump to Top of Station Queue</span>
              <p className="text-xs text-[#8f7e73]">
                Forces this ticket to display at the front of Sauté, Grill & Pasta line rails
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bumpToTop}
                onChange={(e) => setBumpToTop(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2a1e17] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Reason presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
              Priority Reason / Kitchen Log
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {presetReasons.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    reason === preset
                      ? 'border-amber-500/60 bg-amber-500/20 text-amber-200'
                      : 'border-[#2d221b] bg-[#18110d] text-[#b8a69b] hover:border-[#4d3a2e]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Or type custom priority note for station staff..."
              className="w-full rounded-xl border border-[#2d221b] bg-[#140f0c] px-3.5 py-2.5 text-xs text-amber-100 placeholder-[#7a6a5f] focus:border-amber-500/60 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#2d221b] bg-[#120d0a] p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2 text-xs font-semibold text-[#a89689] hover:bg-[#251b14] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2 text-xs font-bold text-[#0c0805] shadow-lg shadow-amber-900/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <CheckCircleIcon size={15} />
            Apply Priority
          </button>
        </div>
      </div>
    </div>
  );
};

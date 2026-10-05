import React, { useState } from 'react';
import type { CashierNotification } from '../../data/mockRestaurantData';
import {
  AlertTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  RotateCcwIcon,
  XIcon,
} from '../Icons';

interface CashierNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CashierNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearRead: () => void;
  embedded?: boolean;
}

export const CashierNotificationsModal: React.FC<CashierNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearRead,
  embedded = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'bills' | 'payments'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'bills') return n.type === 'bill-request';
    if (filter === 'payments') return n.type === 'payment-received' || n.type === 'high-cash';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const cardContent = (
    <div className={`csh-modal-card ${embedded ? 'max-w-4xl mx-auto w-full' : 'max-w-xl max-h-[85vh]'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2d221b] p-4 sm:p-5 shrink-0 bg-[#16100c]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <BellIcon size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <span>Cashier Intercom & Alerts</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-[#0c0805]">
                  {unreadCount} New
                </span>
              )}
            </h2>
            <p className="text-xs text-[#a89689]">
              Live bill requests, payment verification webhooks, and drawer threshold warnings
            </p>
          </div>
        </div>
        {!embedded && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#1a1410] text-[#a89689] hover:text-white"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>

      {/* Filter Tabs & Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#241a12] bg-[#120d0a] px-4 sm:px-5 py-2.5 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#8c7b6d] hover:text-[#c9b8ad]'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#8c7b6d] hover:text-[#c9b8ad]'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('bills')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              filter === 'bills'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#8c7b6d] hover:text-[#c9b8ad]'
            }`}
          >
            Bill Requests
          </button>
          <button
            type="button"
            onClick={() => setFilter('payments')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              filter === 'payments'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#8c7b6d] hover:text-[#c9b8ad]'
            }`}
          >
            Payments
          </button>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-amber-400 hover:underline"
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClearRead}
            className="text-[11px] font-medium text-[#8c7b6d] hover:text-[#c9b8ad]"
          >
            Clear read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 bg-[#0e0a08]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[#8c7b6d] space-y-2">
            <CheckCircleIcon size={32} className="mx-auto text-emerald-500/40" />
            <p className="text-xs">No notifications match this filter.</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                notif.read
                  ? 'border-[#2d221b] bg-[#140f0c] opacity-75'
                  : 'border-amber-500/40 bg-gradient-to-r from-[#1c140e] to-[#140f0c] shadow-md shadow-black/40'
              }`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  notif.type === 'bill-request'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : notif.type === 'payment-received'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : notif.type === 'high-cash'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}
              >
                {notif.type === 'bill-request' && <ClockIcon size={16} />}
                {notif.type === 'payment-received' && <CheckCircleIcon size={16} />}
                {notif.type === 'high-cash' && <DollarSignIcon size={16} />}
                {notif.type === 'refund-request' && <RotateCcwIcon size={16} />}
                {notif.type === 'system' && <AlertTriangleIcon size={16} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-amber-100 truncate">{notif.title}</h4>
                  <span className="text-[10px] text-[#8c7b6d] shrink-0 font-mono">{notif.time}</span>
                </div>
                <p className="text-xs text-[#b8a69b] mt-0.5 leading-relaxed">{notif.message}</p>

                {notif.amount && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-[#1c1510] border border-[#34271c] px-2 py-0.5 text-[11px] font-mono font-bold text-amber-300">
                    Amount: ₹{notif.amount.toLocaleString()}
                  </div>
                )}
              </div>

              {!notif.read && (
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 mt-1 animate-pulse" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#2d221b] bg-[#120d0a] p-4 shrink-0">
        <span className="text-xs text-[#8c7b6d]">
          {unreadCount} unread cashier alerts
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2 text-xs font-semibold text-[#a89689] hover:bg-[#251b14] hover:text-white"
        >
          {embedded ? 'Reset View' : 'Close Alerts'}
        </button>
      </div>
    </div>
  );

  if (embedded) {
    return <div className="w-full">{cardContent}</div>;
  }

  return <div className="csh-modal-overlay">{cardContent}</div>;
};

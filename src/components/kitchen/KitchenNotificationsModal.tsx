import React, { useState } from 'react';
import type { KitchenNotification } from '../../data/mockRestaurantData';
import {
  AlertTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  PackageXIcon,
  SendIcon,
  UserIcon,
  XIcon,
} from '../Icons';

interface KitchenNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: KitchenNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onBroadcastMessage?: (message: string, station: string) => void;
  embedded?: boolean;
}

export const KitchenNotificationsModal: React.FC<KitchenNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onBroadcastMessage,
  embedded = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [quickMsg, setQuickMsg] = useState('');
  const [targetStation, setTargetStation] = useState('all');
  const [showBroadcast, setShowBroadcast] = useState(false);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.type === 'rush-order' || n.type === 'allergy-alert';
    return true;
  });

  const getIconForType = (type: KitchenNotification['type']) => {
    switch (type) {
      case 'rush-order':
        return <FlameIcon size={16} className="text-amber-400" />;
      case 'allergy-alert':
        return <AlertTriangleIcon size={16} className="text-red-400" />;
      case 'delay-warning':
        return <ClockIcon size={16} className="text-amber-400" />;
      case 'order-cancelled':
        return <XIcon size={16} className="text-red-400" />;
      case 'stock-alert':
        return <PackageXIcon size={16} className="text-orange-400" />;
      default:
        return <UserIcon size={16} className="text-blue-400" />;
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickMsg.trim() && onBroadcastMessage) {
      onBroadcastMessage(quickMsg.trim(), targetStation);
      setQuickMsg('');
      setShowBroadcast(false);
    }
  };

  const cardContent = (
    <div className={`kds-modal-card ${embedded ? 'max-w-none w-full border border-[#34271c] shadow-2xl rounded-2xl' : 'max-w-2xl max-h-[88vh]'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2d221b] p-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BellIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-amber-100">
                  Kitchen Notification Dispatch
                </h2>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold text-red-300">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-[#b8a69b]">
                Real-time service alerts, allergy notices & front-of-house communications
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

        {/* Filter Bar & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d221b] bg-[#140f0c] px-5 py-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                  : 'text-[#8f7e73] hover:text-[#c9b8ad]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                  : 'text-[#8f7e73] hover:text-[#c9b8ad]'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                filter === 'urgent'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                  : 'text-[#8f7e73] hover:text-[#c9b8ad]'
              }`}
            >
              Urgent / Allergies
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBroadcast(!showBroadcast)}
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold px-2 py-1 rounded bg-[#251b14] border border-[#3d2f26]"
            >
              {showBroadcast ? 'Hide Intercom' : '+ Line Intercom'}
            </button>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-[#a89689] hover:text-amber-200 underline"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Broadcast Form (Collapsible) */}
        {showBroadcast && (
          <form
            onSubmit={handleBroadcast}
            className="p-3.5 bg-[#18110d] border-b border-[#2d221b] shrink-0 space-y-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                placeholder="Broadcast voice/text dispatch to station displays (e.g., Hold fire Table 12 until desserts)..."
                className="flex-1 rounded-xl border border-[#2d221b] bg-[#140f0c] px-3.5 py-2 text-xs text-amber-100 placeholder-[#7a6a5f] focus:border-amber-500/60 focus:outline-none"
              />
              <select
                value={targetStation}
                onChange={(e) => setTargetStation(e.target.value)}
                className="rounded-xl border border-[#2d221b] bg-[#140f0c] px-2.5 py-2 text-xs text-amber-200 focus:outline-none"
              >
                <option value="all">All Stations</option>
                <option value="grill">Grill</option>
                <option value="saute">Sauté</option>
                <option value="pasta">Pasta</option>
                <option value="cold">Cold Larder</option>
                <option value="pass">Expedite Pass</option>
              </select>
              <button
                type="submit"
                disabled={!quickMsg.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-[#0c0805] disabled:opacity-50 hover:brightness-110"
              >
                <SendIcon size={13} />
                Send
              </button>
            </div>
          </form>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#8f7e73] space-y-2">
              <CheckCircleIcon size={32} className="mx-auto text-emerald-400/60" />
              <p className="text-sm font-medium text-amber-100">All notifications caught up</p>
              <p className="text-xs">No pending kitchen alerts for this filter.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.read && onMarkAsRead(item.id)}
                className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  !item.read
                    ? 'border-amber-500/40 bg-amber-950/15 text-amber-100'
                    : 'border-[#2d221b] bg-[#140f0c] text-[#b8a69b] opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#1d1611]">
                    {getIconForType(item.type)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-200">{item.title}</span>
                      {!item.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-[#c9b8ad]">{item.message}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-[#7a6a5f]">
                      <span>{item.timestamp}</span>
                      {item.orderNumber && (
                        <span>Order #{item.orderNumber}</span>
                      )}
                      {item.tableNumber && (
                        <span>Table {item.tableNumber}</span>
                      )}
                    </div>
                  </div>
                </div>

                {!item.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(item.id);
                    }}
                    className="shrink-0 text-[10px] text-amber-400 hover:text-amber-200 border border-amber-500/30 rounded px-2 py-0.5"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2d221b] bg-[#120d0a] p-4 shrink-0">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-[#7a6a5f] hover:text-red-400 transition-colors"
          >
            Clear Finished Logs
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2 text-xs font-semibold text-[#a89689] hover:bg-[#251b14] hover:text-white"
          >
            {embedded ? 'Refresh Feed' : 'Close Feed'}
          </button>
        </div>
      </div>
  );

  if (embedded) {
    return <div className="w-full">{cardContent}</div>;
  }

  return <div className="kds-modal-overlay">{cardContent}</div>;
};

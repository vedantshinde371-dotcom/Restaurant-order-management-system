import React from 'react';
import './WaiterDashboard.css';
import { XIcon, BellIcon, CheckCheckIcon, ChefHatIcon, UsersIcon, ClockIcon, AlertCircleIcon } from '../Icons';
import { type StaffNotification } from '../../data/mockRestaurantData';

interface StaffNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: StaffNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const StaffNotificationsModal: React.FC<StaffNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread || !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#16120e] border border-[#c9893d]/30 rounded-2xl shadow-2xl overflow-hidden text-[#e8dfd8] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#34271c] bg-[#1c1611]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9893d]/15 border border-[#c9893d]/30 flex items-center justify-center text-[#c9893d]">
              <BellIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold tracking-wide text-[#f5ede4]">
                  Staff Dispatch Alerts
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#c9893d]/20 text-[#e5a962] border border-[#c9893d]/40 font-bold">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a89687]">
                Live kitchen pass alerts, host seating dispatch & floor timers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-[#c9893d] hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#8c7b6d] bg-[#1a140f] rounded-xl border border-[#34271c]">
              No dispatch alerts right now.
            </div>
          ) : (
            notifications.map((notif) => {
              const isUnread = notif.unread || !notif.isRead;
              const iconMap = {
                kitchen: <ChefHatIcon className="w-4 h-4 text-amber-400" />,
                table: <UsersIcon className="w-4 h-4 text-blue-400" />,
                seating: <UsersIcon className="w-4 h-4 text-blue-400" />,
                guest: <BellIcon className="w-4 h-4 text-purple-400" />,
                request: <BellIcon className="w-4 h-4 text-purple-400" />,
                transfer: <BellIcon className="w-4 h-4 text-emerald-400" />,
                delay: <AlertCircleIcon className="w-4 h-4 text-rose-400" />,
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isUnread
                      ? 'bg-[#1e1711] border-[#c9893d]/50 shadow-md'
                      : 'bg-[#17120d] border-[#2c2016] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#271d15] border border-[#3c2b1e] flex items-center justify-center shrink-0">
                        {iconMap[notif.type] || <BellIcon className="w-4 h-4 text-[#c9893d]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#f5ede4]">{notif.title}</h4>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#c9893d]" />
                          )}
                        </div>
                        <p className="text-xs text-[#a89687] mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-[#6d5b4e] mt-1.5 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3 text-[#c9893d]" />
                          {notif.timeAgo || notif.time}
                        </span>
                      </div>
                    </div>

                    {isUnread && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notif.id);
                        }}
                        className="text-xs text-[#c9893d] hover:text-[#f5ede4] p-1"
                        title="Mark as read"
                      >
                        <CheckCheckIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#34271c] bg-[#1a140e] flex justify-end">
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

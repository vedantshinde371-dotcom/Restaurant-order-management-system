import React, { useEffect, useState } from 'react';
import {
  INITIAL_COMPLETED_KITCHEN_TICKETS,
  INITIAL_KITCHEN_NOTIFICATIONS,
  INITIAL_KITCHEN_PROFILE,
  INITIAL_KITCHEN_STOCK,
  INITIAL_KITCHEN_TICKETS,
  type KitchenNotification,
  type KitchenPriority,
  type KitchenStaffProfile,
  type KitchenStockItem,
  type KitchenTicket,
} from '../../data/mockRestaurantData';
import { getCurrentUser } from '../../data/authService';
import {
  ActivityIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FlameIcon,
  LayersIcon,
  PackageXIcon,
  RotateCcwIcon,
  SettingsIcon,
  UtensilsIcon,
  LogOutIcon,
} from '../Icons';
import { DelayAlertModal } from './DelayAlertModal';
import { ExpeditePassView } from './ExpeditePassView';
import { KitchenHistoryView } from './KitchenHistoryView';
import { KitchenNotificationsModal } from './KitchenNotificationsModal';
import { KitchenOverviewView } from './KitchenOverviewView';
import { KitchenProfileModal } from './KitchenProfileModal';
import { KitchenStationView } from './KitchenStationView';
import { NewOrderQueueView } from './NewOrderQueueView';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrderPreparationView } from './OrderPreparationView';
import { PriorityManagementModal } from './PriorityManagementModal';
import { StockIssueModal } from './StockIssueModal';

export type KitchenTab =
  | 'overview'
  | 'queue'
  | 'prep'
  | 'stations'
  | 'pass'
  | 'inventory'
  | 'notifications'
  | 'history'
  | 'profile';

interface KitchenDashboardProps {
  onNavigateToView?: (view: string) => void;
  onLogout?: () => void;
}

export const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ onNavigateToView, onLogout }) => {
  // Main Data States
  const [tickets, setTickets] = useState<KitchenTicket[]>(INITIAL_KITCHEN_TICKETS);
  const [completedTickets, setCompletedTickets] = useState<KitchenTicket[]>(INITIAL_COMPLETED_KITCHEN_TICKETS);
  const [stockItems, setStockItems] = useState<KitchenStockItem[]>(INITIAL_KITCHEN_STOCK);
  const [notifications, setNotifications] = useState<KitchenNotification[]>(INITIAL_KITCHEN_NOTIFICATIONS);
  const [profile, setProfile] = useState<KitchenStaffProfile>(() => {
    const cur = getCurrentUser();
    if (cur && (cur.role === 'kitchen' || cur.role === 'manager')) {
      return {
        ...INITIAL_KITCHEN_PROFILE,
        name: cur.name,
        role: cur.role === 'manager' ? 'Executive Chef / Manager' : 'Executive Head Chef',
        station: 'Head Line / Pass',
      };
    }
    return INITIAL_KITCHEN_PROFILE;
  });

  // Active Sidebar Navigation Tab
  const [activeTab, setActiveTab] = useState<KitchenTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Modal states for direct ticket actions
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState<KitchenTicket | null>(null);
  const [selectedTicketForPriority, setSelectedTicketForPriority] = useState<KitchenTicket | null>(null);
  const [selectedTicketForDelay, setSelectedTicketForDelay] = useState<KitchenTicket | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Digital Kitchen Clock
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // --- Handlers ---

  // 1. Accept order & fire to line
  const handleAcceptOrder = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return { ...t, status: 'preparing' };
        }
        return t;
      })
    );
    const target = tickets.find((t) => t.id === ticketId);
    showToast(`Order #${target?.orderNumber || ticketId} accepted & fired to line stations.`);
  };

  // 2. Toggle item cook completion checkmark
  const handleToggleItemDone = (ticketId: string, itemId: string) => {
    let nextDoneState = false;
    let targetItemName = '';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedItems = t.items.map((item) => {
            if (item.id === itemId) {
              const isCurrentlyReady =
                item.status === 'ready' ||
                item.isCompleted === true ||
                item.completed === true;
              const nextDone = !isCurrentlyReady;
              nextDoneState = nextDone;
              targetItemName = item.name;
              return {
                ...item,
                isCompleted: nextDone,
                completed: nextDone,
                status: (nextDone ? 'ready' : 'cooking') as 'ready' | 'cooking',
              };
            }
            return item;
          });

          // Check if all items in this order are now ready
          const allReady =
            updatedItems.length > 0 &&
            updatedItems.every(
              (i) =>
                i.status === 'ready' ||
                i.isCompleted === true ||
                i.completed === true
            );

          // If all items become ready, mark complete order as 'ready' (READY FOR PASS / READY TO SERVE)
          // If unchecking an item when order was ready, revert order back to 'preparing'
          let nextTicketStatus = t.status;
          if (allReady) {
            nextTicketStatus = 'ready';
          } else if (t.status === 'ready') {
            nextTicketStatus = 'preparing';
          } else if (t.status === 'queued') {
            nextTicketStatus = 'preparing';
          }

          const updatedTicket = { ...t, items: updatedItems, status: nextTicketStatus };
          if (selectedTicketForDetails?.id === ticketId) {
            setSelectedTicketForDetails(updatedTicket);
          }
          return updatedTicket;
        }
        return t;
      })
    );

    if (targetItemName) {
      if (nextDoneState) {
        showToast(`"${targetItemName}" marked READY → Moved to Ready to Serve / Pass.`);
      } else {
        showToast(`"${targetItemName}" recalled back to Cooking Checklist.`);
      }
    }
  };

  // 3. Advance ticket status (queued -> preparing/cooking -> ready -> completed)
  const handleAdvanceTicketStatus = (ticketId: string) => {
    const current = tickets.find((t) => t.id === ticketId);
    if (!current) return;

    if (current.status === 'queued') {
      handleAcceptOrder(ticketId);
    } else if (current.status === 'ready') {
      const completedTicket: KitchenTicket = {
        ...current,
        status: 'completed',
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actualPrepTimeMinutes: current.elapsedMinutes,
      };

      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setCompletedTickets((prev) => [completedTicket, ...prev]);
      showToast(`Order #${current.orderNumber} expedited & cleared to Expedite Pass / Server Pickup.`);
    } else {
      // Order had status 'preparing', 'cooking', or 'plating'
      // Mark all items ready and set status to 'ready'
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            const updatedItems = t.items.map((i) => ({
              ...i,
              isCompleted: true,
              completed: true,
              status: 'ready' as const,
            }));
            const updated = { ...t, items: updatedItems, status: 'ready' as const };
            if (selectedTicketForDetails?.id === ticketId) {
              setSelectedTicketForDetails(updated);
            }
            return updated;
          }
          return t;
        })
      );
      showToast(`Order #${current.orderNumber} marked READY FOR PASS.`);
    }
  };

  // 4. Update order priority
  const handleUpdatePriority = (
    ticketId: string,
    priority: KitchenPriority,
    bumpToTop: boolean,
    reason: string
  ) => {
    setTickets((prev) => {
      const updated = prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            priority,
            notes: reason ? `${t.notes || ''} [Priority: ${priority} - ${reason}]` : t.notes,
          };
        }
        return t;
      });

      if (bumpToTop) {
        const idx = updated.findIndex((t) => t.id === ticketId);
        if (idx > -1) {
          const [bumped] = updated.splice(idx, 1);
          return [bumped, ...updated];
        }
      }
      return updated;
    });

    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      const newNotif: KitchenNotification = {
        id: `notif-${Date.now()}`,
        type: 'rush-order',
        title: `Priority Bump: Order #${target.orderNumber}`,
        message: `Set to ${priority.toUpperCase()} priority: ${reason || 'Chef expedited'}`,
        timestamp: 'Just now',
        orderNumber: target.orderNumber,
        tableNumber: target.tableNumber,
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    showToast(`Order #${target?.orderNumber} priority set to ${priority.toUpperCase()}.`);
  };

  // 5. Broadcast delay
  const handleBroadcastDelay = (
    ticketId: string,
    extraMinutes: number,
    reason: string,
    notifyFloor: boolean
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            isDelayed: true,
            estimatedTimeMinutes: (t.estimatedTimeMinutes || t.targetMinutes || 15) + extraMinutes,
            delayReason: reason,
          };
        }
        return t;
      })
    );

    const target = tickets.find((t) => t.id === ticketId);
    if (notifyFloor && target) {
      const newNotif: KitchenNotification = {
        id: `notif-${Date.now()}`,
        type: 'delay-warning',
        title: `Delay Warning (+${extraMinutes}m): Order #${target.orderNumber}`,
        message: `Reason: ${reason}. Service staff & customer informed.`,
        timestamp: 'Just now',
        orderNumber: target.orderNumber,
        tableNumber: target.tableNumber,
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    showToast(`Delay broadcasted (+${extraMinutes} mins) for Order #${target?.orderNumber}.`);
  };

  // 6. Toggle Stock 86 status
  const handleToggleStock = (
    itemId: string,
    newStatus: 'in-stock' | 'low-stock' | '86-out-of-stock',
    remainingServings?: number
  ) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status: newStatus,
            remainingServings: remainingServings !== undefined ? remainingServings : item.remainingServings,
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );

    const itm = stockItems.find((i) => i.id === itemId);
    if (itm) {
      showToast(`Stock updated: ${itm.name} is now ${newStatus.replace('-', ' ').toUpperCase()}`);
    }
  };

  // 7. Report ticket item issue
  const handleReportItemIssue = (
    ticketId: string,
    itemId: string,
    issueType: string,
    proposedSub: string
  ) => {
    const target = tickets.find((t) => t.id === ticketId);
    const newNotif: KitchenNotification = {
      id: `notif-${Date.now()}`,
      type: 'stock-alert',
      title: `Item Issue on Order #${target?.orderNumber || ticketId}`,
      message: `Item: ${itemId}. Issue: ${issueType}. Proposed Sub: ${proposedSub}`,
      timestamp: 'Just now',
      orderNumber: target?.orderNumber,
      tableNumber: target?.tableNumber,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Issue reported to Waiter Station: ${itemId} -> ${proposedSub}`);
  };

  // 8. Recall ticket from history back to active prep line
  const handleRecallTicket = (ticketId: string) => {
    const target = completedTickets.find((t) => t.id === ticketId);
    if (!target) return;

    const recalled: KitchenTicket = {
      ...target,
      status: 'preparing',
      priority: 'urgent',
      notes: `${target.notes || ''} [RECALLED TO LINE FOR RE-FIRE / CORRECTION]`,
    };

    setCompletedTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setTickets((prev) => [recalled, ...prev]);
    showToast(`Order #${target.orderNumber} RECALLED to active cooking line.`);
  };

  // 9. Notifications actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    showToast('Read notifications cleared.');
  };

  const handleBroadcastMessage = (message: string, station: string) => {
    const newNotif: KitchenNotification = {
      id: `notif-${Date.now()}`,
      type: 'server-message',
      title: `Chef Intercom -> [${station.toUpperCase()}]`,
      message,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Line broadcast sent to ${station.toUpperCase()} station.`);
  };

  // Telemetry counts
  const queuedCount = tickets.filter((t) => t.status === 'queued').length;
  const preparingCount = tickets.filter((t) => t.status === 'preparing').length;
  const readyCount = tickets.filter((t) => t.status === 'ready').length;
  const overdueCount = tickets.filter((t) => t.isDelayed || t.elapsedMinutes > (t.estimatedTimeMinutes || t.targetMinutes || 15)).length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const stock86Count = stockItems.filter((i) => i.status === '86-out-of-stock').length;

  return (
    <div className="kds-app-layout font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast alert banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-amber-500/40 bg-[#160f0b] px-4 py-3 text-xs font-semibold text-amber-200 shadow-2xl shadow-amber-950/50 animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          DEDICATED KITCHEN SIDEBAR NAVIGATION
          ======================================================== */}
      <aside className={`kds-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header with Brand & Collapse Button */}
        <div className="kds-sidebar-header">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-[#0c0805] shadow-lg shadow-amber-950/50 font-serif font-black text-base">
                KDS
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-serif font-bold text-amber-100 truncate">
                  Le Bistro Pass
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-[#9f8d81]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">Station: {profile.station}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-[#0c0805] font-serif font-black text-base shadow-lg shadow-amber-950/50">
              K
            </div>
          )}

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#1a1410] text-[#a89689] hover:text-amber-200 hover:border-amber-500/40 transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle kitchen navigation sidebar"
          >
            {sidebarCollapsed ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="kds-sidebar-nav">
          {/* Section 1: Line Operations */}
          <div className="kds-nav-section-title">
            {!sidebarCollapsed && 'Line Operations'}
          </div>

          {/* 1. Overview */}
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`kds-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            title="Executive Overview & Radar"
          >
            <div className="kds-nav-btn-inner">
              <ActivityIcon size={17} className={activeTab === 'overview' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Executive Overview</span>}
            </div>
          </button>

          {/* 2. New Order Queue */}
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`kds-nav-btn ${activeTab === 'queue' ? 'active' : ''}`}
            title="New Order Queue"
          >
            <div className="kds-nav-btn-inner">
              <ClockIcon size={17} className={activeTab === 'queue' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>New Order Queue</span>}
            </div>
            {queuedCount > 0 && (
              <span className={`kds-nav-badge ${activeTab === 'queue' ? 'bg-amber-400 text-[#0c0805]' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                {queuedCount}
              </span>
            )}
          </button>

          {/* 3. Active Cooking Line */}
          <button
            type="button"
            onClick={() => setActiveTab('prep')}
            className={`kds-nav-btn ${activeTab === 'prep' ? 'active' : ''}`}
            title="Active Cooking Line"
          >
            <div className="kds-nav-btn-inner">
              <FlameIcon size={17} className={activeTab === 'prep' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Active Cooking Line</span>}
            </div>
            {preparingCount > 0 && (
              <span className="kds-nav-badge">
                {preparingCount}
              </span>
            )}
          </button>

          {/* 4. Kitchen Stations */}
          <button
            type="button"
            onClick={() => setActiveTab('stations')}
            className={`kds-nav-btn ${activeTab === 'stations' ? 'active' : ''}`}
            title="Kitchen Station Lines (5)"
          >
            <div className="kds-nav-btn-inner">
              <LayersIcon size={17} className={activeTab === 'stations' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Station Lines (5)</span>}
            </div>
          </button>

          {/* 5. Expedite Pass & Plated */}
          <button
            type="button"
            onClick={() => setActiveTab('pass')}
            className={`kds-nav-btn ${activeTab === 'pass' ? 'active' : ''}`}
            title="Expedite Pass & Plated"
          >
            <div className="kds-nav-btn-inner">
              <UtensilsIcon size={17} className={activeTab === 'pass' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Expedite Pass</span>}
            </div>
            {readyCount > 0 && (
              <span className="kds-nav-badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                {readyCount}
              </span>
            )}
          </button>

          {/* Section 2: Management & Communication */}
          <div className="kds-nav-section-title mt-3">
            {!sidebarCollapsed && 'Pass Management'}
          </div>

          {/* 6. 86'd Board & Stock */}
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`kds-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            title="86'd Board & Stock Issues"
          >
            <div className="kds-nav-btn-inner">
              <PackageXIcon size={17} className={activeTab === 'inventory' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>86'd & Stock Board</span>}
            </div>
            {stock86Count > 0 && (
              <span className="kds-nav-badge bg-red-600/30 text-red-300 border-red-500/40">
                {stock86Count}
              </span>
            )}
          </button>

          {/* 7. Intercom & Alerts */}
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`kds-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            title="Intercom & Notifications"
          >
            <div className="kds-nav-btn-inner">
              <BellIcon size={17} className={activeTab === 'notifications' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Intercom & Alerts</span>}
            </div>
            {unreadNotifCount > 0 && (
              <span className="kds-nav-badge bg-amber-500 text-[#0c0805] font-bold">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* 8. Shift History */}
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`kds-nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            title="Shift History & Recall"
          >
            <div className="kds-nav-btn-inner">
              <RotateCcwIcon size={17} className={activeTab === 'history' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Shift History</span>}
            </div>
            <span className="kds-nav-badge">
              {completedTickets.length}
            </span>
          </button>

          {/* 9. Chef Profile & Settings */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`kds-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            title="Chef Profile & KDS Settings"
          >
            <div className="kds-nav-btn-inner">
              <SettingsIcon size={17} className={activeTab === 'profile' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Chef Pass & Settings</span>}
            </div>
          </button>
        </nav>

        {/* Sidebar Footer: Chef Status & Portals Switcher */}
        <div className="kds-sidebar-footer space-y-2">
          {!sidebarCollapsed ? (
            <>
              {/* Chef mini info */}
              <div className="flex items-center gap-3 rounded-xl border border-[#2d221b] bg-[#140f0c] p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif text-xs font-bold">
                  {profile.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-amber-100 truncate">{profile.name}</div>
                  <div className="text-[10px] text-amber-400/80 truncate">{profile.role}</div>
                </div>
              </div>

              {/* Dedicated Sign Out Button */}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-900/50 bg-[#200c0c] py-2 text-[11px] font-semibold text-rose-300 hover:bg-rose-900/30 hover:border-rose-700 transition-all w-full cursor-pointer mt-2"
                  title="Sign Out of Kitchen Display System"
                >
                  <LogOutIcon size={12} className="text-rose-400" />
                  <span>Sign Out Chef</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-900/50 bg-[#200c0c] text-rose-300 hover:bg-rose-900/30 cursor-pointer"
                  title="Sign Out Chef"
                >
                  <LogOutIcon size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================
          MAIN VIEWPORT WORKSPACE
          ======================================================== */}
      <div className="kds-main-viewport">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 border-b border-[#241a14] bg-[#120d0a]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-serif font-bold text-amber-100 tracking-wide">
                {activeTab === 'overview' && 'KDS Executive Overview'}
                {activeTab === 'queue' && 'Incoming Order Queue'}
                {activeTab === 'prep' && 'Active Cooking Hot Line'}
                {activeTab === 'stations' && 'Line Stations Dispatch (5 Stations)'}
                {activeTab === 'pass' && 'Expedite Pass & Plated Orders'}
                {activeTab === 'inventory' && "86'd Out of Stock & Item Board"}
                {activeTab === 'notifications' && 'Kitchen Intercom & Shift Notifications'}
                {activeTab === 'history' && 'Completed Orders Shift History'}
                {activeTab === 'profile' && 'Kitchen Staff Credentials & Settings'}
              </h1>
              <span className="hidden sm:inline-block rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                Pass Mode
              </span>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Service Clock */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 bg-[#1a120e] border border-[#3d2f26] px-3.5 py-1.5 rounded-xl shadow-inner">
              <ClockIcon size={14} className="text-amber-400" />
              <span>{currentTime}</span>
            </div>

            {/* Overdue alert if any */}
            {overdueCount > 0 && (
              <span className="rounded-xl border border-red-500/50 bg-red-950/40 px-2.5 py-1.5 text-xs font-bold text-red-300 animate-pulse hidden sm:inline-block">
                {overdueCount} Delayed
              </span>
            )}

            {/* Quick 86'd Board Modal Opener */}
            <button
              type="button"
              onClick={() => setIsStockModalOpen(true)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                stock86Count > 0
                  ? 'border-red-500/50 bg-red-950/30 text-red-300 hover:bg-red-950/50'
                  : 'border-[#3d2f26] bg-[#1a1410] text-[#c9b8ad] hover:text-white'
              }`}
              title="Open 86'd Stock Modal"
            >
              <PackageXIcon size={14} />
              <span className="hidden md:inline">86'd Items</span>
              {stock86Count > 0 && (
                <span className="rounded bg-red-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {stock86Count}
                </span>
              )}
            </button>

            {/* Quick Intercom Modal Opener */}
            <button
              type="button"
              onClick={() => setIsNotificationsModalOpen(true)}
              className={`relative flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                unreadNotifCount > 0
                  ? 'border-amber-500/50 bg-amber-950/40 text-amber-200 hover:bg-amber-950/60'
                  : 'border-[#3d2f26] bg-[#1a1410] text-[#c9b8ad] hover:text-white'
              }`}
              title="Open Intercom Modal"
            >
              <BellIcon size={14} />
              <span className="hidden md:inline">Intercom</span>
              {unreadNotifCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-[#0c0805]">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Quick Chef Settings Modal Opener */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs font-semibold text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200 transition-all"
              title="Open Chef Settings"
            >
              <SettingsIcon size={14} />
              <span className="hidden lg:inline">Settings</span>
            </button>
          </div>
        </header>

        {/* Dynamic Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <KitchenOverviewView
              tickets={tickets}
              completedTickets={completedTickets}
              stockItems={stockItems}
              onSelectNav={(tab: string) => setActiveTab(tab as KitchenTab)}
              onOpenDetails={(t) => setSelectedTicketForDetails(t)}
              onOpenPriority={(t) => setSelectedTicketForPriority(t)}
              onOpenDelay={(t) => setSelectedTicketForDelay(t)}
            />
          )}

          {/* 2. New Order Queue */}
          {activeTab === 'queue' && (
            <NewOrderQueueView
              tickets={tickets}
              onAcceptOrder={handleAcceptOrder}
              onOpenDetails={(t) => setSelectedTicketForDetails(t)}
              onOpenPriority={(t) => setSelectedTicketForPriority(t)}
              onOpenDelay={(t) => setSelectedTicketForDelay(t)}
            />
          )}

          {/* 3. Active Cooking Line */}
          {activeTab === 'prep' && (
            <OrderPreparationView
              tickets={tickets}
              onToggleItemDone={handleToggleItemDone}
              onAdvanceTicketStatus={handleAdvanceTicketStatus}
              onOpenDetails={(t) => setSelectedTicketForDetails(t)}
              onOpenPriority={(t) => setSelectedTicketForPriority(t)}
              onOpenDelay={(t) => setSelectedTicketForDelay(t)}
            />
          )}

          {/* 4. Kitchen Stations */}
          {activeTab === 'stations' && (
            <KitchenStationView
              tickets={tickets}
              onToggleItemDone={handleToggleItemDone}
            />
          )}

          {/* 5. Expedite Pass & Plated */}
          {activeTab === 'pass' && (
            <ExpeditePassView
              tickets={tickets}
              onCompleteTicket={handleAdvanceTicketStatus}
              onRecallToPrep={(ticketId) => {
                setTickets((prev) =>
                  prev.map((t) => (t.id === ticketId ? { ...t, status: 'preparing' } : t))
                );
                showToast('Order recalled to cooking line.');
              }}
              onOpenDetails={(t) => setSelectedTicketForDetails(t)}
            />
          )}

          {/* 6. 86'd Board & Stock Issues (Embedded View) */}
          {activeTab === 'inventory' && (
            <StockIssueModal
              isOpen={true}
              onClose={() => setActiveTab('overview')}
              stockItems={stockItems}
              onToggleStock={handleToggleStock}
              activeTickets={tickets.filter((t) => t.status !== 'completed')}
              onReportItemIssue={handleReportItemIssue}
              embedded={true}
            />
          )}

          {/* 7. Intercom & Alerts (Embedded View) */}
          {activeTab === 'notifications' && (
            <KitchenNotificationsModal
              isOpen={true}
              onClose={() => setActiveTab('overview')}
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationRead}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onClearAll={handleClearNotifications}
              onBroadcastMessage={handleBroadcastMessage}
              embedded={true}
            />
          )}

          {/* 8. Shift History */}
          {activeTab === 'history' && (
            <KitchenHistoryView
              completedTickets={completedTickets}
              onRecallTicket={handleRecallTicket}
              onOpenDetails={(t) => setSelectedTicketForDetails(t)}
            />
          )}

          {/* 9. Chef Profile & Settings (Embedded View) */}
          {activeTab === 'profile' && (
            <KitchenProfileModal
              isOpen={true}
              onClose={() => setActiveTab('overview')}
              profile={profile}
              onUpdateProfile={(newProfile) => {
                setProfile(newProfile);
                showToast('Kitchen profile & preferences saved.');
              }}
              onNavigateToView={onNavigateToView}
              embedded={true}
            />
          )}
        </main>
      </div>

      {/* ========================================================
          POPUP MODALS (Accessible from any view via ticket actions)
          ======================================================== */}

      {/* Ticket Details Modal */}
      {selectedTicketForDetails && (
        <OrderDetailsModal
          ticket={selectedTicketForDetails}
          isOpen={true}
          onClose={() => setSelectedTicketForDetails(null)}
          onAdvanceTicketStatus={handleAdvanceTicketStatus}
          onToggleItemComplete={(ticketId, itemId) => {
            handleToggleItemDone(ticketId, itemId);
          }}
          onToggleItemCompletion={(itemId) => {
            handleToggleItemDone(selectedTicketForDetails.id, itemId);
          }}
          onPrintKitchenSlip={(orderNumber) => {
            showToast(`Thermal ticket slip printed for Order #${orderNumber}`);
          }}
        />
      )}

      {/* Delay Alert & Broadcast Modal */}
      {selectedTicketForDelay && (
        <DelayAlertModal
          ticket={selectedTicketForDelay}
          isOpen={true}
          onClose={() => setSelectedTicketForDelay(null)}
          onBroadcastDelay={handleBroadcastDelay}
        />
      )}

      {/* Order Priority Management Modal */}
      {selectedTicketForPriority && (
        <PriorityManagementModal
          ticket={selectedTicketForPriority}
          isOpen={true}
          onClose={() => setSelectedTicketForPriority(null)}
          onUpdatePriority={handleUpdatePriority}
        />
      )}

      {/* Out-of-Stock / Item Issue Floating Modal */}
      <StockIssueModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        stockItems={stockItems}
        onToggleStock={handleToggleStock}
        activeTickets={tickets.filter((t) => t.status !== 'completed')}
        onReportItemIssue={handleReportItemIssue}
        embedded={false}
      />

      {/* Kitchen Notifications & Intercom Floating Modal */}
      <KitchenNotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearNotifications}
        onBroadcastMessage={handleBroadcastMessage}
        embedded={false}
      />

      {/* Kitchen Profile & Settings Floating Modal */}
      <KitchenProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={(newProfile) => {
          setProfile(newProfile);
          showToast('Kitchen profile & preferences saved.');
        }}
        onNavigateToView={onNavigateToView}
        embedded={false}
      />
    </div>
  );
};
export default KitchenDashboard;

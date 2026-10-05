import React, { useState, useEffect } from 'react';
import './WaiterDashboard.css';
import {
  LayoutGridIcon,
  ChefHatIcon,
  BellRingIcon,
  BellIcon,
  ClockIcon,
  UsersIcon,
  DollarSignIcon,
  SparklesIcon,
  PlusIcon,
  ClipboardListIcon,
  LogOutIcon,
} from '../Icons';
import {
  type MenuItem,
  type WaiterFloorTable,
  type CustomerAssistanceRequest,
  type ReadyToServeDish,
  type StaffNotification,
  type WaiterStaffProfile,
  type ActiveOrder,
  type TableTransferRecord,
  INITIAL_WAITER_FLOOR_TABLES,
  INITIAL_CUSTOMER_REQUESTS,
  INITIAL_READY_TO_SERVE,
  INITIAL_STAFF_NOTIFICATIONS,
  INITIAL_WAITER_PROFILE,
} from '../../data/mockRestaurantData';

import { TableManagementView } from './TableManagementView';
import { KitchenOrderTrackingView } from './KitchenOrderTrackingView';
import { ReadyToServeView } from './ReadyToServeView';
import { OrderHistoryView } from './OrderHistoryView';

import { NewOrderModal } from './NewOrderModal';
import { OrderModificationModal } from './OrderModificationModal';
import { BillPaymentModal } from './BillPaymentModal';
import { TableTransferModal, type TransferExecutionParams } from './TableTransferModal';
import { CustomerRequestsModal } from './CustomerRequestsModal';
import { StaffNotificationsModal } from './StaffNotificationsModal';
import { WaiterProfileModal } from './WaiterProfileModal';

interface WaiterDashboardProps {
  menuItems: MenuItem[];
  onSwitchToCustomerPortal?: () => void;
  onSwitchToCashierPortal?: () => void;
  onSwitchToKitchenPortal?: () => void;
  onSwitchToManagerPortal?: () => void;
  onLogout?: () => void;
}

export const WaiterDashboard: React.FC<WaiterDashboardProps> = ({
  menuItems,
  onSwitchToCustomerPortal,
  onSwitchToCashierPortal: _onSwitchToCashierPortal,
  onSwitchToKitchenPortal: _onSwitchToKitchenPortal,
  onSwitchToManagerPortal: _onSwitchToManagerPortal,
  onLogout,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'floor' | 'kitchen' | 'ready' | 'history'>('floor');

  // Core Data States
  const [tables, setTables] = useState<WaiterFloorTable[]>(INITIAL_WAITER_FLOOR_TABLES);
  const [customerRequests, setCustomerRequests] = useState<CustomerAssistanceRequest[]>(INITIAL_CUSTOMER_REQUESTS);
  const [readyDishes, setReadyDishes] = useState<ReadyToServeDish[]>(INITIAL_READY_TO_SERVE);
  const [staffNotifications, setStaffNotifications] = useState<StaffNotification[]>(INITIAL_STAFF_NOTIFICATIONS);
  const [profile, setProfile] = useState<WaiterStaffProfile>(INITIAL_WAITER_PROFILE);

  // Selected Table Context for modals
  const [selectedTable, setSelectedTable] = useState<WaiterFloorTable | null>(null);

  // Modal Visibility States
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isModifyOrderOpen, setIsModifyOrderOpen] = useState(false);
  const [isBillPaymentOpen, setIsBillPaymentOpen] = useState(false);
  const [isTableTransferOpen, setIsTableTransferOpen] = useState(false);
  const [isCustomerRequestsOpen, setIsCustomerRequestsOpen] = useState(false);
  const [isStaffNotificationsOpen, setIsStaffNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Live Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Unread badge counts
  const pendingRequestsCount = customerRequests.filter((r) => r.status === 'pending').length;
  const unreadAlertsCount = staffNotifications.filter((n) => n.unread || !n.isRead).length;

  // KPI Calculations
  const occupiedCount = tables.filter((t) => t.status === 'occupied' || t.status === 'waiting' || t.status === 'waiting-for-order').length;
  const totalGuests = tables
    .filter((t) => t.status === 'occupied' || t.status === 'waiting' || t.status === 'waiting-for-order')
    .reduce((sum, t) => sum + (t.guestsCount || t.seatedGuests || 0), 0);
  const currentFloorRevenue = tables
    .filter((t) => t.status === 'occupied')
    .reduce((sum, t) => sum + (t.currentBill || t.currentBillTotal || 0), 0);

  // Handlers for New Order creation
  const handleOpenNewOrder = (table?: WaiterFloorTable) => {
    setSelectedTable(table || tables.find((t) => t.status === 'available') || tables[0]);
    setIsNewOrderOpen(true);
  };

  const handleOrderFired = (order: ActiveOrder) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber === order.tableNumber) {
          return {
            ...t,
            status: 'occupied',
            guestsCount: 2,
            currentBill: order.total,
            currentBillTotal: order.total,
            seatedMinutes: 2,
            activeOrderId: order.id,
            activeOrderDetails: {
              orderId: order.id,
              courseStage: 'appetizers',
              items: order.items.map((i) => ({
                id: i.dishId || `dish-${Date.now()}-${Math.random()}`,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
                status: 'cooking',
                notes: i.specialInstructions,
              })),
              elapsedMinutes: 2,
            },
          };
        }
        return t;
      })
    );

    // Also add to staff notifications
    const newNotif: StaffNotification = {
      id: `sn-${Date.now()}`,
      title: `${order.tableNumber} Order Fired`,
      message: `${order.items.length} items routed to hot kitchen pass by ${profile.name}`,
      time: 'Just now',
      timeAgo: 'Just now',
      type: 'kitchen',
      unread: true,
      isRead: false,
    };
    setStaffNotifications((prev) => [newNotif, ...prev]);
  };

  // Handlers for Order Modification
  const handleOpenModifyOrder = (table: WaiterFloorTable) => {
    setSelectedTable(table);
    setIsModifyOrderOpen(true);
  };

  const handleSaveOrderModification = (
    tableNumber: string,
    updatedItems: { id: string; name: string; quantity: number; price: number; notes?: string; status: 'queued' | 'cooking' | 'plating' | 'ready' | 'served' }[],
    newSubtotal: number
  ) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber === tableNumber) {
          return {
            ...t,
            currentBill: newSubtotal,
            currentBillTotal: newSubtotal,
            activeOrderDetails: t.activeOrderDetails
              ? {
                  ...t.activeOrderDetails,
                  items: updatedItems,
                }
              : undefined,
          };
        }
        return t;
      })
    );
  };

  // Handlers for Bill Payment Settlement
  const handleOpenBillSettlement = (table: WaiterFloorTable) => {
    setSelectedTable(table);
    setIsBillPaymentOpen(true);
  };

  const handleSettleBill = (
    tableNumber: string,
    _paymentMethod: string,
    tipAmount: number,
    totalPaid: number
  ) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber === tableNumber) {
          return {
            ...t,
            status: 'cleaning',
            currentBill: 0,
            currentBillTotal: 0,
            guestsCount: 0,
            seatedGuests: 0,
            seatedMinutes: 0,
            activeOrderId: undefined,
            activeOrderDetails: undefined,
          };
        }
        return t;
      })
    );

    // Update server tip and shift sales
    setProfile((prev) => ({
      ...prev,
      tablesTurned: prev.tablesTurned + 1,
      tablesServedToday: (prev.tablesServedToday || prev.tablesTurned) + 1,
      shiftSales: prev.shiftSales + totalPaid,
      totalSalesToday: (prev.totalSalesToday || prev.shiftSales) + totalPaid,
      shiftTips: prev.shiftTips + tipAmount,
      tipsEarnedToday: (prev.tipsEarnedToday || prev.shiftTips) + tipAmount,
    }));
  };

  // Handlers for Table Transfer
  const handleOpenTableTransfer = (table: WaiterFloorTable) => {
    setSelectedTable(table);
    setIsTableTransferOpen(true);
  };

  const handleExecuteTransfer = (params: TransferExecutionParams) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const record: TableTransferRecord = {
      id: `xfer-${Date.now()}`,
      timestamp,
      type: params.type,
      fromTable: params.sourceTableNum,
      toTable:
        params.type === 'transfer'
          ? params.targetTableNum || undefined
          : params.type === 'split'
          ? params.targetTableNum || undefined
          : params.type === 'merge'
          ? (params.targetTableNums || []).join(', ')
          : undefined,
      targetServer: params.type === 'server' ? params.targetServerName || undefined : undefined,
      performedBy: params.performedBy,
      reason: params.reason,
      itemsSummary: params.splitItems
        ? params.splitItems.map((i) => `${i.quantity}x ${i.name}`).join(', ')
        : undefined,
    };

    setTables((prev) => {
      const source = prev.find((t) => t.tableNumber === params.sourceTableNum);
      if (!source) return prev;

      // 1. RELOCATE / TRANSFER ORDER TO ANOTHER TABLE
      if (params.type === 'transfer' && params.targetTableNum) {
        return prev.map((t) => {
          if (t.tableNumber === params.sourceTableNum) {
            return {
              ...t,
              status: 'cleaning',
              currentBill: 0,
              currentBillTotal: 0,
              guestsCount: 0,
              seatedGuests: 0,
              seatedMinutes: 0,
              activeOrderId: undefined,
              activeOrderDetails: undefined,
              transferHistory: [record, ...(t.transferHistory || [])],
            };
          }
          if (t.tableNumber === params.targetTableNum) {
            return {
              ...t,
              status: 'occupied',
              guestsCount: source.guestsCount || source.seatedGuests || 2,
              seatedGuests: source.seatedGuests || source.guestsCount || 2,
              currentBill: source.currentBill || source.currentBillTotal || 0,
              currentBillTotal: source.currentBillTotal || source.currentBill || 0,
              seatedMinutes: source.seatedMinutes || 10,
              activeOrderId: source.activeOrderId,
              activeOrderDetails: source.activeOrderDetails,
              courseProgress: source.courseProgress,
              transferHistory: [record, ...(t.transferHistory || [])],
            };
          }
          return t;
        });
      }

      // 2. MERGE TABLES FOR LARGE GROUPS
      if (params.type === 'merge' && params.targetTableNums && params.targetTableNums.length > 0) {
        const mergedTablesList = prev.filter((t) => params.targetTableNums?.includes(t.tableNumber));
        const additionalCapacity = mergedTablesList.reduce((sum, t) => sum + t.capacity, 0);

        return prev.map((t) => {
          if (t.tableNumber === params.sourceTableNum) {
            return {
              ...t,
              isMerged: true,
              mergedWith: Array.from(new Set([...(t.mergedWith || []), ...(params.targetTableNums || [])])),
              capacity: t.capacity + additionalCapacity,
              transferHistory: [record, ...(t.transferHistory || [])],
            };
          }
          if (params.targetTableNums?.includes(t.tableNumber)) {
            return {
              ...t,
              status: 'occupied',
              isMerged: true,
              mergedParent: params.sourceTableNum,
              guestsCount: 0,
              currentBill: 0,
              currentBillTotal: 0,
              activeOrderId: undefined,
              transferHistory: [record, ...(t.transferHistory || [])],
            };
          }
          return t;
        });
      }

      // 3. SPLIT TABLES WHEN REQUIRED
      if (params.type === 'split' && params.targetTableNum && params.splitItems) {
        const splitBill = params.splitItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const splitGuests = params.splitGuestsCount || 1;

        // Calculate remaining items on source table
        const remainingItems = (source.activeOrderDetails?.items || [])
          .map((item) => {
            const moved = params.splitItems?.find((s) => s.name === item.name);
            const remainingQty = item.quantity - (moved?.quantity || 0);
            return remainingQty > 0 ? { ...item, quantity: remainingQty } : null;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        const remainingBill = remainingItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return prev.map((t) => {
          if (t.tableNumber === params.sourceTableNum) {
            return {
              ...t,
              guestsCount: Math.max(1, (t.guestsCount || 2) - splitGuests),
              seatedGuests: Math.max(1, (t.seatedGuests || 2) - splitGuests),
              currentBill: remainingBill,
              currentBillTotal: remainingBill,
              activeOrderDetails: t.activeOrderDetails
                ? {
                    ...t.activeOrderDetails,
                    items: remainingItems,
                  }
                : undefined,
              transferHistory: [record, ...(t.transferHistory || [])],
            };
          }
          if (t.tableNumber === params.targetTableNum) {
            return {
              ...t,
              status: 'occupied',
              splitFrom: params.sourceTableNum,
              guestsCount: splitGuests,
              seatedGuests: splitGuests,
              seatedMinutes: source.seatedMinutes || 10,
              currentBill: splitBill,
              currentBillTotal: splitBill,
              activeOrderId: `${source.activeOrderId || 'ORD'}-SPLIT`,
              activeOrderDetails: {
                orderId: `${source.activeOrderId || 'ORD'}-SPLIT`,
                courseStage: source.activeOrderDetails?.courseStage || 'mains',
                items: params.splitItems || [],
                elapsedMinutes: source.activeOrderDetails?.elapsedMinutes || 5,
              },
              courseProgress: source.courseProgress,
              transferHistory: [record, ...(t.transferHistory || [])],
            };
          }
          return t;
        });
      }

      // 4. REASSIGN SERVER OWNERSHIP
      if (params.type === 'server' && params.targetServerName) {
        return prev.map((t) => {
          if (t.tableNumber === params.sourceTableNum) {
            return {
              ...t,
              assignedServer: params.targetServerName!,
              serverName: params.targetServerName!,
              transferHistory: [record, ...(t.transferHistory || [])],
            };
          }
          return t;
        });
      }

      return prev;
    });

    // Staff Dispatch Notification
    const notifTitle =
      params.type === 'transfer'
        ? `Table Order Moved: ${params.sourceTableNum} → ${params.targetTableNum}`
        : params.type === 'merge'
        ? `Tables Merged: ${params.sourceTableNum} + ${(params.targetTableNums || []).join(', ')}`
        : params.type === 'split'
        ? `Table Split: ${params.sourceTableNum} → ${params.targetTableNum}`
        : `Service Reassigned: ${params.sourceTableNum} → ${params.targetServerName}`;

    const notifMsg = `Authorized by ${params.performedBy}. Reason: ${params.reason}. Floor map and KDS updated.`;

    const newNotif: StaffNotification = {
      id: `sn-${Date.now()}`,
      title: notifTitle,
      message: notifMsg,
      time: 'Just now',
      timeAgo: 'Just now',
      tableNumber: params.sourceTableNum,
      type: 'seating',
      unread: true,
      isRead: false,
    };
    setStaffNotifications((prev) => [newNotif, ...prev]);
  };

  // Handlers for Table Cleaning / Bussing
  const handleMarkTableCleaned = (tableNumber: string) => {
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, status: 'available' } : t))
    );
  };

  // Handlers for Kitchen Course Firing
  const handleFireNextCourse = (tableNumber: string, nextCourse: 'mains' | 'desserts') => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber === tableNumber && t.activeOrderDetails) {
          return {
            ...t,
            courseProgress: nextCourse === 'mains' ? 'Mains' : 'Desserts',
            activeOrderDetails: {
              ...t.activeOrderDetails,
              courseStage: nextCourse,
            },
          };
        }
        return t;
      })
    );
  };

  // Handlers for Ready to Serve Pass
  const handleMarkDishServed = (id: string) => {
    setReadyDishes((prev) => prev.filter((d) => d.id !== id));
  };

  const handleMarkAllTableDishesServed = (tableNumber: string) => {
    setReadyDishes((prev) => prev.filter((d) => d.tableNumber !== tableNumber));
  };

  // Handlers for Customer Requests
  const handleAcknowledgeRequest = (id: string) => {
    setCustomerRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'in_progress' } : r))
    );
  };

  const handleCompleteRequest = (id: string) => {
    setCustomerRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'completed' } : r))
    );
  };

  // Handlers for Staff Dispatch Notifications
  const handleMarkAsRead = (id: string) => {
    setStaffNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setStaffNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, unread: false })));
  };

  return (
    <div className="min-h-screen bg-[#110e0b] text-[#e8dfd8] flex flex-col font-sans selection:bg-[#c9893d] selection:text-[#110e0b]">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 bg-[#16120e]/95 backdrop-blur-md border-b border-[#34271c] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Section Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9893d] to-[#e5a962] text-[#140f0c] flex items-center justify-center font-serif font-black text-xl shadow-lg shadow-[#c9893d]/20">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-wider text-base text-[#f5ede4]">
                  SAVOIR STAFF
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#c9893d]/15 text-[#e5a962] border border-[#c9893d]/30">
                  Floor Captain POS
                </span>
              </div>
              <div className="text-[11px] text-[#8c7b6d] flex items-center gap-2">
                <span>Station: {profile.station}</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline text-emerald-400">Shift Active</span>
              </div>
            </div>
          </div>

          {/* Quick Action Topbar Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b1510] border border-[#34271c] text-xs text-[#a89687]">
              <ClockIcon className="w-3.5 h-3.5 text-[#c9893d]" />
              <span className="font-mono text-[#f5ede4] font-medium">{currentTime}</span>
            </div>

            {/* New Order POS Quick Action Button */}
            <button
              onClick={() => handleOpenNewOrder()}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#c9893d] to-[#e5a962] text-[#140f0c] text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New Order</span>
            </button>

            {/* Customer Requests Buzzer Trigger */}
            <button
              onClick={() => setIsCustomerRequestsOpen(true)}
              className="relative p-2 rounded-xl bg-[#1b1510] hover:bg-[#251e17] border border-[#34271c] text-[#e8dfd8] transition-colors"
              title="Guest Assistance Calls"
            >
              <BellRingIcon className="w-5 h-5 text-[#c9893d]" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Staff Dispatch Alerts Trigger */}
            <button
              onClick={() => setIsStaffNotificationsOpen(true)}
              className="relative p-2 rounded-xl bg-[#1b1510] hover:bg-[#251e17] border border-[#34271c] text-[#e8dfd8] transition-colors"
              title="Staff Alerts"
            >
              <BellIcon className="w-5 h-5 text-[#a89687]" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c9893d] text-[#140f0c] text-[10px] font-bold flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Waiter Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#1b1510] hover:bg-[#251e17] border border-[#34271c] text-xs text-[#f5ede4] transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-[#c9893d]/20 border border-[#c9893d] text-[#c9893d] text-[11px] font-bold flex items-center justify-center">
                MV
              </div>
              <span className="hidden md:inline font-medium">{profile.name}</span>
            </button>


            {/* Dedicated Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2a1313] to-[#1a0c0c] hover:from-rose-900 hover:to-rose-800 text-rose-300 hover:text-white border border-rose-800/50 hover:border-rose-600 text-xs font-bold shadow-md transition-all group cursor-pointer"
                title="Sign Out of Waiter POS"
                aria-label="Sign Out"
              >
                <LogOutIcon className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
                <span className="font-serif tracking-wide text-xs whitespace-nowrap">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Top Shift KPI Banner */}
      <section className="bg-[#15110d] border-b border-[#2d2218] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-[#1a140f] border border-[#34271c]">
            <div className="flex items-center justify-between text-xs text-[#8c7b6d] mb-1">
              <span>Occupied Tables</span>
              <LayoutGridIcon className="w-3.5 h-3.5 text-[#c9893d]" />
            </div>
            <div className="font-serif text-lg font-bold text-[#f5ede4]">
              {occupiedCount} / {tables.length}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              {Math.round((occupiedCount / tables.length) * 100)}% Occupancy
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1a140f] border border-[#34271c]">
            <div className="flex items-center justify-between text-xs text-[#8c7b6d] mb-1">
              <span>Covers Seated</span>
              <UsersIcon className="w-3.5 h-3.5 text-[#c9893d]" />
            </div>
            <div className="font-serif text-lg font-bold text-[#f5ede4]">{totalGuests} Guests</div>
            <div className="text-[10px] text-[#a89687] mt-0.5">Across active dining zones</div>
          </div>

          <div className="p-3 rounded-xl bg-[#1a140f] border border-[#34271c]">
            <div className="flex items-center justify-between text-xs text-[#8c7b6d] mb-1">
              <span>Plates at Pass</span>
              <ChefHatIcon className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-serif text-lg font-bold text-amber-300">
              {readyDishes.length} Dishes
            </div>
            <div className="text-[10px] text-[#8c7b6d] mt-0.5">Under heat lamps</div>
          </div>

          <div className="p-3 rounded-xl bg-[#1a140f] border border-[#34271c]">
            <div className="flex items-center justify-between text-xs text-[#8c7b6d] mb-1">
              <span>Active Floor Sales</span>
              <DollarSignIcon className="w-3.5 h-3.5 text-[#c9893d]" />
            </div>
            <div className="font-serif text-lg font-bold text-[#f5ede4]">
              ₹{currentFloorRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">In-progress checks</div>
          </div>

          <div className="p-3 rounded-xl bg-[#1a140f] border border-[#34271c] col-span-2 sm:col-span-4 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-[#8c7b6d] mb-1">
              <span>Guest Calls</span>
              <BellRingIcon className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="font-serif text-lg font-bold text-rose-300">
              {pendingRequestsCount} Pending
            </div>
            <div className="text-[10px] text-[#8c7b6d] mt-0.5">
              Avg dispatch: 45s
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sub-Navigation Tabs */}
      <section className="bg-[#140f0c] border-b border-[#2d2218] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar py-2.5">
          <button
            onClick={() => setActiveTab('floor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'floor'
                ? 'bg-[#c9893d] text-[#140f0c] shadow-lg shadow-[#c9893d]/20'
                : 'text-[#a89687] hover:text-[#f5ede4] hover:bg-[#1f1812]'
            }`}
          >
            <LayoutGridIcon className="w-4 h-4" />
            Floor Layout & Tables
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'kitchen'
                ? 'bg-[#c9893d] text-[#140f0c] shadow-lg shadow-[#c9893d]/20'
                : 'text-[#a89687] hover:text-[#f5ede4] hover:bg-[#1f1812]'
            }`}
          >
            <ChefHatIcon className="w-4 h-4" />
            Kitchen KDS Tracking
          </button>

          <button
            onClick={() => setActiveTab('ready')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 relative ${
              activeTab === 'ready'
                ? 'bg-[#c9893d] text-[#140f0c] shadow-lg shadow-[#c9893d]/20'
                : 'text-[#a89687] hover:text-[#f5ede4] hover:bg-[#1f1812]'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            Ready to Serve Pass
            {readyDishes.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'ready' ? 'bg-[#140f0c] text-[#c9893d]' : 'bg-[#c9893d] text-[#140f0c]'
                }`}
              >
                {readyDishes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#c9893d] text-[#140f0c] shadow-lg shadow-[#c9893d]/20'
                : 'text-[#a89687] hover:text-[#f5ede4] hover:bg-[#1f1812]'
            }`}
          >
            <ClipboardListIcon className="w-4 h-4" />
            Shift Order History
          </button>
        </div>
      </section>

      {/* 4. Active Sub-View Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
        {activeTab === 'floor' && (
          <TableManagementView
            tables={tables}
            onOpenNewOrder={handleOpenNewOrder}
            onOpenModifyOrder={handleOpenModifyOrder}
            onOpenBillSettlement={handleOpenBillSettlement}
            onOpenTableTransfer={handleOpenTableTransfer}
            onMarkTableCleaned={handleMarkTableCleaned}
          />
        )}

        {activeTab === 'kitchen' && (
          <KitchenOrderTrackingView
            tables={tables}
            onFireNextCourse={handleFireNextCourse}
            onOpenModifyOrder={handleOpenModifyOrder}
          />
        )}

        {activeTab === 'ready' && (
          <ReadyToServeView
            dishes={readyDishes}
            onMarkDishServed={handleMarkDishServed}
            onMarkAllTableDishesServed={handleMarkAllTableDishesServed}
          />
        )}

        {activeTab === 'history' && <OrderHistoryView />}
      </main>

      {/* 5. Modals and Drawers */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        tables={tables}
        selectedTableNumber={selectedTable?.tableNumber}
        onFireOrder={handleOrderFired}
      />

      <OrderModificationModal
        isOpen={isModifyOrderOpen}
        onClose={() => setIsModifyOrderOpen(false)}
        table={selectedTable}
        menuItems={menuItems}
        onSaveOrderModification={handleSaveOrderModification}
      />

      <BillPaymentModal
        isOpen={isBillPaymentOpen}
        onClose={() => setIsBillPaymentOpen(false)}
        table={selectedTable}
        onSettleBill={handleSettleBill}
      />

      <TableTransferModal
        isOpen={isTableTransferOpen}
        onClose={() => setIsTableTransferOpen(false)}
        currentTable={selectedTable}
        allTables={tables}
        currentStaffName={profile.name}
        onExecuteTransfer={handleExecuteTransfer}
      />

      <CustomerRequestsModal
        isOpen={isCustomerRequestsOpen}
        onClose={() => setIsCustomerRequestsOpen(false)}
        requests={customerRequests}
        onAcknowledgeRequest={handleAcknowledgeRequest}
        onCompleteRequest={handleCompleteRequest}
      />

      <StaffNotificationsModal
        isOpen={isStaffNotificationsOpen}
        onClose={() => setIsStaffNotificationsOpen(false)}
        notifications={staffNotifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <WaiterProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSwitchToCustomerPortal={onSwitchToCustomerPortal}
      />
    </div>
  );
};

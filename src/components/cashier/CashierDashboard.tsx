import React, { useEffect, useState } from 'react';
import {
  INITIAL_CASHIER_BILLS,
  INITIAL_CASHIER_NOTIFICATIONS,
  INITIAL_CASHIER_PROFILE,
  INITIAL_CASHIER_SHIFT,
  type CashierBill,
  type CashierNotification,
  type CashierPaymentRecord,
  type CashierProfile,
  type CashierRefundRecord,
  type CashierShiftSummary,
} from '../../data/mockRestaurantData';
import {
  BanknoteIcon,
  BellIcon,
  CashierIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DollarSignIcon,
  FileTextIcon,
  QrCodeIcon,
  RotateCcwIcon,
  SearchIcon,
  SettingsIcon,
  SplitIcon,
  LogOutIcon,
} from '../Icons';
import { BillGenerationView } from './BillGenerationView';
import { BillSearchArchiveView } from './BillSearchArchiveView';
import { CashierNotificationsModal } from './CashierNotificationsModal';
import { CashierOverviewView } from './CashierOverviewView';
import { CashierProfileModal } from './CashierProfileModal';
import { DailyShiftSummaryView } from './DailyShiftSummaryView';
import { PaymentProcessingView } from './PaymentProcessingView';
import { PaymentVerificationView } from './PaymentVerificationView';
import { ReceiptManagerModal } from './ReceiptManagerModal';
import { RefundManagementView } from './RefundManagementView';
import { SplitBillView } from './SplitBillView';

export type CashierTab =
  | 'dashboard'
  | 'billing'
  | 'payments'
  | 'split'
  | 'search'
  | 'refunds'
  | 'verification'
  | 'shift'
  | 'notifications'
  | 'profile';

interface CashierDashboardProps {
  onNavigateToView?: (view: string) => void;
  onLogout?: () => void;
}

export const CashierDashboard: React.FC<CashierDashboardProps> = ({ onNavigateToView, onLogout }) => {
  // Main Data States
  const [bills, setBills] = useState<CashierBill[]>(INITIAL_CASHIER_BILLS);
  const [selectedBill, setSelectedBill] = useState<CashierBill | null>(INITIAL_CASHIER_BILLS[0]);
  const [shiftSummary, setShiftSummary] = useState<CashierShiftSummary>(INITIAL_CASHIER_SHIFT);
  const [profile, setProfile] = useState<CashierProfile>(INITIAL_CASHIER_PROFILE);
  const [notifications, setNotifications] = useState<CashierNotification[]>(INITIAL_CASHIER_NOTIFICATIONS);

  // Active View Tab & Sidebar state
  const [activeTab, setActiveTab] = useState<CashierTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Modal states
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [billForReceipt, setBillForReceipt] = useState<CashierBill | null>(null);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Digital POS Clock
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

  // 1. Save or update bill
  const handleSaveBill = (updatedBill: CashierBill) => {
    setBills((prev) =>
      prev.map((b) => (b.id === updatedBill.id ? updatedBill : b))
    );
    setSelectedBill(updatedBill);
    showToast(`Bill #${updatedBill.billNumber} (${updatedBill.tableNumber || updatedBill.orderType}) updated.`);
  };

  // 2. Record payment settlement
  const handleRecordPayment = (billId: string, payment: CashierPaymentRecord) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const newPaid = b.paidAmount + payment.amount;
          const newRemaining = Math.max(0, b.finalPayable - newPaid);
          const isComplete = newRemaining === 0;

          return {
            ...b,
            paidAmount: newPaid,
            remainingBalance: newRemaining,
            status: isComplete ? 'paid' : 'partially-paid',
            closedAt: isComplete ? payment.timestamp : b.closedAt,
            payments: [payment, ...b.payments],
          };
        }
        return b;
      })
    );

    // Update Shift Totals
    setShiftSummary((prev) => {
      const isCash = payment.method === 'cash';
      const isUpi = payment.method === 'upi';
      const isCard = payment.method === 'card';

      return {
        ...prev,
        cashSales: isCash ? prev.cashSales + payment.amount : prev.cashSales,
        cashInDrawerExpected: isCash ? prev.cashInDrawerExpected + payment.amount : prev.cashInDrawerExpected,
        cashInDrawerActual: isCash ? prev.cashInDrawerActual + payment.amount : prev.cashInDrawerActual,
        upiSales: isUpi ? prev.upiSales + payment.amount : prev.upiSales,
        cardSales: isCard ? prev.cardSales + payment.amount : prev.cardSales,
        grossSales: prev.grossSales + payment.amount,
        billsSettledCount: prev.billsSettledCount + 1,
      };
    });

    const target = bills.find((b) => b.id === billId);
    showToast(`Payment of ₹${payment.amount} settled via ${payment.method.toUpperCase()} for ${target?.billNumber}.`);
  };

  // 3. Execute Refund / Void
  const handleExecuteRefund = (billId: string, refund: CashierRefundRecord) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const isFull = refund.refundType === 'full' || refund.refundType === 'void';
          return {
            ...b,
            status: isFull ? 'voided' : b.status,
            refunds: [refund, ...(b.refunds || [])],
            paidAmount: isFull ? 0 : Math.max(0, b.paidAmount - refund.refundAmount),
          };
        }
        return b;
      })
    );

    // Update Shift Summary for refunds
    setShiftSummary((prev) => ({
      ...prev,
      cashRefunds: refund.refundMethod === 'cash' ? prev.cashRefunds + refund.refundAmount : prev.cashRefunds,
      cashInDrawerExpected:
        refund.refundMethod === 'cash' ? prev.cashInDrawerExpected - refund.refundAmount : prev.cashInDrawerExpected,
      billsVoidedCount: prev.billsVoidedCount + 1,
    }));

    showToast(`Credit Note #${refund.creditNoteNumber} issued: ₹${refund.refundAmount} refunded.`);
  };

  // 4. Receipt opener helper
  const handleOpenReceipt = (bill: CashierBill) => {
    setBillForReceipt(bill);
    setIsReceiptModalOpen(true);
  };

  // 5. Payment initiator helper
  const handleOpenPayment = (bill: CashierBill) => {
    setSelectedBill(bill);
    setActiveTab('payments');
  };

  // 6. Split initiator helper
  const handleOpenSplit = (bill: CashierBill) => {
    setSelectedBill(bill);
    setActiveTab('split');
  };

  // 7. Notification actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All cashier notifications marked as read.');
  };

  const handleClearReadNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    showToast('Read notifications cleared.');
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const pendingBillsCount = bills.filter((b) => b.status === 'generated' || b.status === 'unbilled').length;

  return (
    <div className="csh-app-layout font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-amber-500/40 bg-[#160f0b] px-4 py-3 text-xs font-semibold text-amber-200 shadow-2xl shadow-amber-950/50 animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          CASHIER SIDEBAR NAVIGATION
          ======================================================== */}
      <aside className={`csh-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Header with Brand & Collapse Button */}
        <div className="csh-sidebar-header">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-[#0c0805] shadow-lg shadow-amber-950/50 font-serif font-black text-base">
                POS
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-serif font-bold text-amber-100 truncate">
                  Le Bistro Cashier
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-[#9f8d81]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">{profile.name}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-[#0c0805] font-serif font-black text-base shadow-lg shadow-amber-950/50">
              $
            </div>
          )}

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#1a1410] text-[#a89689] hover:text-amber-200 hover:border-amber-500/40 transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle navigation sidebar"
          >
            {sidebarCollapsed ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="csh-sidebar-nav">
          <div className="csh-nav-section-title">
            {!sidebarCollapsed && 'Cashier Operations'}
          </div>

          {/* 1. Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`csh-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            title="Cashier Dashboard"
          >
            <div className="csh-nav-btn-inner">
              <CashierIcon size={17} className={activeTab === 'dashboard' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Dashboard Overview</span>}
            </div>
            {pendingBillsCount > 0 && (
              <span className="csh-nav-badge">
                {pendingBillsCount}
              </span>
            )}
          </button>

          {/* 2. Bill Generation & Modification */}
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`csh-nav-btn ${activeTab === 'billing' ? 'active' : ''}`}
            title="Generate & Modify Bills"
          >
            <div className="csh-nav-btn-inner">
              <FileTextIcon size={17} className={activeTab === 'billing' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Bill Generation & Edit</span>}
            </div>
          </button>

          {/* 3. Payment Processing */}
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`csh-nav-btn ${activeTab === 'payments' ? 'active' : ''}`}
            title="Multi-Tender Payments"
          >
            <div className="csh-nav-btn-inner">
              <DollarSignIcon size={17} className={activeTab === 'payments' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Payment Processing</span>}
            </div>
          </button>

          {/* 4. Split Bill */}
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`csh-nav-btn ${activeTab === 'split' ? 'active' : ''}`}
            title="Split Bill Studio"
          >
            <div className="csh-nav-btn-inner">
              <SplitIcon size={17} className={activeTab === 'split' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Split Bill Studio</span>}
            </div>
          </button>

          <div className="csh-nav-section-title mt-3">
            {!sidebarCollapsed && 'Audits & Records'}
          </div>

          {/* 5. Search Archive & Receipts */}
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`csh-nav-btn ${activeTab === 'search' ? 'active' : ''}`}
            title="Order & Bill Search"
          >
            <div className="csh-nav-btn-inner">
              <SearchIcon size={17} className={activeTab === 'search' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Search & Receipts</span>}
            </div>
          </button>

          {/* 6. Refunds & Cancellations */}
          <button
            type="button"
            onClick={() => setActiveTab('refunds')}
            className={`csh-nav-btn ${activeTab === 'refunds' ? 'active' : ''}`}
            title="Refunds & Voids"
          >
            <div className="csh-nav-btn-inner">
              <RotateCcwIcon size={17} className={activeTab === 'refunds' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Refunds & Voids</span>}
            </div>
          </button>

          {/* 7. Electronic Payment Verification */}
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`csh-nav-btn ${activeTab === 'verification' ? 'active' : ''}`}
            title="Payment Verification Queue"
          >
            <div className="csh-nav-btn-inner">
              <QrCodeIcon size={17} className={activeTab === 'verification' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>UPI & Card Verify</span>}
            </div>
          </button>

          {/* 8. Daily Sales & Z-Report */}
          <button
            type="button"
            onClick={() => setActiveTab('shift')}
            className={`csh-nav-btn ${activeTab === 'shift' ? 'active' : ''}`}
            title="Daily Sales & Shift Summary"
          >
            <div className="csh-nav-btn-inner">
              <BanknoteIcon size={17} className={activeTab === 'shift' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Shift Sales & Z-Report</span>}
            </div>
          </button>

          <div className="csh-nav-section-title mt-3">
            {!sidebarCollapsed && 'Preferences'}
          </div>

          {/* 9. Notifications */}
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`csh-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            title="Intercom & Alerts"
          >
            <div className="csh-nav-btn-inner">
              <BellIcon size={17} className={activeTab === 'notifications' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>Intercom & Alerts</span>}
            </div>
            {unreadNotifCount > 0 && (
              <span className="csh-nav-badge bg-amber-500 text-[#0c0805]">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* 10. Profile & Settings */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`csh-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            title="Cashier Settings"
          >
            <div className="csh-nav-btn-inner">
              <SettingsIcon size={17} className={activeTab === 'profile' ? 'text-amber-400' : 'text-[#8c7b6d]'} />
              {!sidebarCollapsed && <span>POS Profile & Rules</span>}
            </div>
          </button>
        </nav>

        {/* Sidebar Footer: Quick Cross-Portal Switcher */}
        <div className="csh-sidebar-footer space-y-2">
          {!sidebarCollapsed ? (
            <>
              {/* Cashier Badge */}
              <div className="flex items-center gap-2.5 rounded-xl border border-[#2d221b] bg-[#140f0c] p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif text-xs font-bold">
                  PS
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-amber-100 truncate">{profile.name}</div>
                  <div className="text-[10px] text-amber-400/80 truncate">Float: ₹{shiftSummary.openingFloat}</div>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-rose-900/50 bg-[#200c0c] py-2 text-[11px] font-semibold text-rose-300 hover:bg-rose-900/30 hover:border-rose-700 transition-all mt-2 cursor-pointer"
                  title="Sign Out of Cashier POS Terminal"
                >
                  <LogOutIcon size={12} className="text-rose-400" />
                  <span>Sign Out Cashier</span>
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
                  title="Sign Out Cashier"
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
      <div className="csh-main-viewport">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 border-b border-[#241a12] bg-[#120d0a]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-serif font-bold text-amber-100 tracking-wide">
              {activeTab === 'dashboard' && 'Cashier Billing & POS Overview'}
              {activeTab === 'billing' && 'Bill Generation & Modification'}
              {activeTab === 'payments' && 'Multi-Tender Payment Terminal'}
              {activeTab === 'split' && 'Split Bill & Independent Settlement'}
              {activeTab === 'search' && 'Order & Bill Search Archive'}
              {activeTab === 'refunds' && 'Refunds & Cancellation Manager'}
              {activeTab === 'verification' && 'Electronic Payment Webhook Verification'}
              {activeTab === 'shift' && 'Daily Sales & Cash Float Z-Report'}
              {activeTab === 'notifications' && 'Cashier Intercom & Shift Notifications'}
              {activeTab === 'profile' && 'Cashier Profile & Tax Configurations'}
            </h1>
            <span className="hidden sm:inline-block rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Live Register
            </span>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Service Clock */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 bg-[#1a120e] border border-[#3d2f26] px-3.5 py-1.5 rounded-xl shadow-inner">
              <ClockIcon size={14} className="text-amber-400" />
              <span>{currentTime}</span>
            </div>

            {/* Cash Drawer Float Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('shift')}
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/40 transition-all"
              title="Click to view Cash Drawer Reconciliation"
            >
              <BanknoteIcon size={14} />
              <span>Float: ₹{shiftSummary.cashInDrawerExpected.toLocaleString()}</span>
            </button>

            {/* Quick Notifications Button */}
            <button
              type="button"
              onClick={() => setIsNotificationsModalOpen(true)}
              className={`relative flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                unreadNotifCount > 0
                  ? 'border-amber-500/50 bg-amber-950/40 text-amber-200 hover:bg-amber-950/60'
                  : 'border-[#3d2f26] bg-[#1a1410] text-[#c9b8ad] hover:text-white'
              }`}
              title="Open Notifications"
            >
              <BellIcon size={14} />
              <span className="hidden md:inline">Alerts</span>
              {unreadNotifCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-[#0c0805]">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Quick Profile & Settings */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs font-semibold text-[#c9b8ad] hover:border-amber-500/40 hover:text-amber-200 transition-all"
              title="Open Cashier Settings"
            >
              <SettingsIcon size={14} />
              <span className="hidden lg:inline">Settings</span>
            </button>
          </div>
        </header>

        {/* Dynamic Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* 1. Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <CashierOverviewView
              bills={bills}
              shiftSummary={shiftSummary}
              onSelectBill={(bill) => {
                setSelectedBill(bill);
                setActiveTab('billing');
              }}
              onNavigateTab={(tab) => setActiveTab(tab as CashierTab)}
              onOpenReceipt={handleOpenReceipt}
              onOpenPayment={handleOpenPayment}
              onOpenSplit={handleOpenSplit}
            />
          )}

          {/* 2. Bill Generation & Modification */}
          {activeTab === 'billing' && (
            <BillGenerationView
              bills={bills}
              selectedBill={selectedBill}
              profile={profile}
              onSaveBill={handleSaveBill}
              onProceedToPayment={handleOpenPayment}
              onProceedToSplit={handleOpenSplit}
              onOpenReceipt={handleOpenReceipt}
            />
          )}

          {/* 3. Payment Processing */}
          {activeTab === 'payments' && (
            <PaymentProcessingView
              bill={selectedBill}
              cashierName={profile.name}
              onRecordPayment={handleRecordPayment}
              onOpenReceipt={handleOpenReceipt}
              onNavigateTab={(tab) => setActiveTab(tab as CashierTab)}
            />
          )}

          {/* 4. Split Bill Studio */}
          {activeTab === 'split' && (
            <SplitBillView
              bill={selectedBill}
              onUpdateSplitBill={handleSaveBill}
              onNavigateTab={(tab) => setActiveTab(tab as CashierTab)}
              onOpenReceipt={handleOpenReceipt}
            />
          )}

          {/* 5. Search Archive & Receipts */}
          {activeTab === 'search' && (
            <BillSearchArchiveView
              bills={bills}
              onOpenReceipt={handleOpenReceipt}
              onSelectBillForEdit={(bill) => {
                setSelectedBill(bill);
                setActiveTab('billing');
              }}
              onInitiateRefund={(bill) => {
                setSelectedBill(bill);
                setActiveTab('refunds');
              }}
            />
          )}

          {/* 6. Refunds & Cancellations */}
          {activeTab === 'refunds' && (
            <RefundManagementView
              bills={bills}
              selectedBillForRefund={selectedBill}
              onExecuteRefund={handleExecuteRefund}
              onNavigateTab={(tab) => setActiveTab(tab as CashierTab)}
            />
          )}

          {/* 7. Electronic Payment Verification */}
          {activeTab === 'verification' && (
            <PaymentVerificationView
              bills={bills}
              onConfirmVerification={(billNum) => {
                showToast(`Payment confirmed for ${billNum}. Check marked settled.`);
              }}
            />
          )}

          {/* 8. Daily Sales & Z-Report */}
          {activeTab === 'shift' && (
            <DailyShiftSummaryView
              shiftSummary={shiftSummary}
              onUpdateShiftSummary={(updated) => setShiftSummary(updated)}
            />
          )}

          {/* 9. Notifications (Embedded View) */}
          {activeTab === 'notifications' && (
            <CashierNotificationsModal
              isOpen={true}
              onClose={() => setActiveTab('dashboard')}
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationRead}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onClearRead={handleClearReadNotifications}
              embedded={true}
            />
          )}

          {/* 10. Profile & Settings (Embedded View) */}
          {activeTab === 'profile' && (
            <CashierProfileModal
              isOpen={true}
              onClose={() => setActiveTab('dashboard')}
              profile={profile}
              onUpdateProfile={(newProfile) => {
                setProfile(newProfile);
                showToast('POS preferences and receipt branding updated.');
              }}
              onNavigateToView={onNavigateToView}
              embedded={true}
            />
          )}
        </main>
      </div>

      {/* ========================================================
          POPUP MODALS
          ======================================================== */}

      {/* Thermal 80mm Receipt Preview Modal */}
      {isReceiptModalOpen && billForReceipt && (
        <ReceiptManagerModal
          isOpen={true}
          onClose={() => setIsReceiptModalOpen(false)}
          bill={billForReceipt}
          profile={profile}
          onPrintSuccess={() => showToast('Receipt printed successfully.')}
        />
      )}

      {/* Floating Notifications Modal */}
      <CashierNotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearRead={handleClearReadNotifications}
        embedded={false}
      />

      {/* Floating Profile & Settings Modal */}
      <CashierProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={(newProfile) => {
          setProfile(newProfile);
          showToast('POS preferences and receipt branding updated.');
        }}
        onNavigateToView={onNavigateToView}
        embedded={false}
      />
    </div>
  );
};

export default CashierDashboard;

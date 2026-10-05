import React, { useState, useEffect } from 'react';
import './ManagerDashboard.css';
import {
  INITIAL_MANAGER_KPI,
  INITIAL_HOURLY_SALES,
  INITIAL_CATEGORY_SHARES,
  INITIAL_MANAGER_INVENTORY,
  INITIAL_MANAGER_TABLES,
  INITIAL_MANAGER_STAFF,
  INITIAL_MANAGER_STATIONS,
  INITIAL_MANAGER_OFFERS,
  INITIAL_MANAGER_AUDIT_LOGS,
  INITIAL_MANAGER_NOTIFICATIONS,
  INITIAL_MANAGER_PROFILE,
  INITIAL_MANAGER_REVIEWS,
  type ManagerInventoryItem,
  type ManagerFloorTable,
  type ManagerStaffMember,
  type ManagerStationConfig,
  type ManagerDiscountOffer,
  type ManagerAuditLog,
  type ManagerNotification,
  type ManagerProfile,
} from '../../data/mockRestaurantData';

import { ManagerOverviewView } from './ManagerOverviewView';
import { SalesRevenueAnalyticsView } from './SalesRevenueAnalyticsView';
import { OrderAnalyticsView } from './OrderAnalyticsView';
import { MenuManagementView } from './MenuManagementView';
import { InventoryManagementView } from './InventoryManagementView';
import { TableLayoutManagementView } from './TableLayoutManagementView';
import { StaffManagementView } from './StaffManagementView';
import { KitchenOrderConfigView } from './KitchenOrderConfigView';
import { DiscountsOffersView } from './DiscountsOffersView';
import { ReportsView } from './ReportsView';
import { CustomerFeedbackView } from './CustomerFeedbackView';
import { AuditActivityView } from './AuditActivityView';
import { RestaurantSettingsView } from './RestaurantSettingsView';
import { ManagerNotificationsModal } from './ManagerNotificationsModal';
import { ManagerProfileModal } from './ManagerProfileModal';

import {
  BellIcon,
  CrownIcon,
  BarChartIcon,
  PieChartIcon,
  BriefcaseIcon,
  SlidersIcon,
  TagIcon,
  ClockIcon,
  UsersIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  UtensilsIcon,
  LogOutIcon,
} from '../Icons';

export type ManagerTab =
  | 'overview'
  | 'sales-analytics'
  | 'order-analytics'
  | 'tables'
  | 'menu'
  | 'inventory'
  | 'staff'
  | 'kitchen-config'
  | 'discounts'
  | 'reports'
  | 'feedback'
  | 'audit'
  | 'settings';

interface ManagerDashboardProps {
  onNavigateToView?: (view: 'customer' | 'waiter-dashboard' | 'kitchen-dashboard' | 'cashier-dashboard') => void;
  onLogout?: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onNavigateToView, onLogout }) => {
  const [activeTab, setActiveTab] = useState<ManagerTab>('overview');
  const [currentTime, setCurrentTime] = useState<string>('22:30:00');

  // Shared reactive states
  const [kpis] = useState(INITIAL_MANAGER_KPI);
  const [hourlySales] = useState(INITIAL_HOURLY_SALES);
  const [categoryShares] = useState(INITIAL_CATEGORY_SHARES);
  const [inventory, setInventory] = useState<ManagerInventoryItem[]>(INITIAL_MANAGER_INVENTORY);
  const [tables, setTables] = useState<ManagerFloorTable[]>(INITIAL_MANAGER_TABLES);
  const [staff, setStaff] = useState<ManagerStaffMember[]>(INITIAL_MANAGER_STAFF);
  const [stations, setStations] = useState<ManagerStationConfig[]>(INITIAL_MANAGER_STATIONS);
  const [offers, setOffers] = useState<ManagerDiscountOffer[]>(INITIAL_MANAGER_OFFERS);
  const [auditLogs, setAuditLogs] = useState<ManagerAuditLog[]>(INITIAL_MANAGER_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<ManagerNotification[]>(INITIAL_MANAGER_NOTIFICATIONS);
  const [profile, setProfile] = useState<ManagerProfile>(INITIAL_MANAGER_PROFILE);

  // Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogAudit = (
    action: string,
    module: ManagerAuditLog['module'],
    details: string,
    severity: ManagerAuditLog['severity'] = 'info'
  ) => {
    const newLog: ManagerAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: currentTime,
      actor: profile.name,
      role: profile.role,
      action,
      module,
      details,
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSendBroadcast = (channel: 'all' | 'kitchen' | 'waiters', message: string) => {
    handleLogAudit(
      'Staff Intercom Broadcast Sent',
      'Staff',
      `Transmitted broadcast to ${channel.toUpperCase()}: "${message}"`,
      'info'
    );
    const newNotif: ManagerNotification = {
      id: `mnotif-${Date.now()}`,
      title: `Broadcast to ${channel.toUpperCase()}`,
      message,
      time: 'Just now',
      type: 'alert',
      read: true,
      severity: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdatePin = (newPin: string) => {
    setProfile((prev) => ({ ...prev, securityPin: newPin }));
    handleLogAudit('Master Security PIN Updated', 'Security', 'Manager master override PIN successfully modified.', 'critical');
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mgr-container">
      {/* Top Header Bar */}
      <header className="mgr-header">
        <div className="mgr-brand">
          <div className="mgr-brand-badge">
            <CrownIcon />
          </div>
          <div>
            <h1 className="mgr-brand-title">SAVORIA PALACE</h1>
            <span className="mgr-brand-sub">Executive General Manager Console</span>
          </div>
        </div>

        <div className="mgr-header-right">
          <div className="mgr-clock">
            <ClockIcon />
            <span>{currentTime}</span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>LIVE</span>
          </div>


          {/* Notification Button */}
          <button
            type="button"
            className="mgr-icon-btn"
            style={{ position: 'relative' }}
            onClick={() => setIsNotificationsOpen(true)}
            title="Operational Alerts & Dispatch"
          >
            <BellIcon />
            {unreadNotifCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Manager Profile Trigger */}
          <button
            type="button"
            className="mgr-profile-pill"
            onClick={() => setIsProfileOpen(true)}
            title="Profile & Security PIN"
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9893d 0%, #e5a962 100%)',
                color: '#140f0c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              AK
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f5efe6' }}>{profile.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#c9893d' }}>PIN: ****</div>
            </div>
          </button>

          {/* Sign Out Button */}
          {onLogout && (
            <button
              type="button"
              className="mgr-secondary-btn"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
              }}
              onClick={onLogout}
              title="Sign Out of Manager Console"
            >
              <LogOutIcon size={13} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace with Sidebar & Content */}
      <div className="mgr-layout">
        {/* Navigation Sidebar */}
        <nav className="mgr-sidebar">
          <div className="mgr-nav-section">
            <span className="mgr-nav-section-title">EXECUTIVE COCKPIT</span>
            <button
              className={`mgr-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <CrownIcon /> Executive Overview
            </button>
            <button
              className={`mgr-nav-item ${activeTab === 'sales-analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales-analytics')}
            >
              <BarChartIcon /> Sales & Revenue
            </button>
            <button
              className={`mgr-nav-item ${activeTab === 'order-analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('order-analytics')}
            >
              <PieChartIcon /> Order Analytics
            </button>
          </div>

          <div className="mgr-nav-section">
            <span className="mgr-nav-section-title">DINING & FLOOR</span>
            <button
              className={`mgr-nav-item ${activeTab === 'tables' ? 'active' : ''}`}
              onClick={() => setActiveTab('tables')}
            >
              <UtensilsIcon /> Tables & Floor Plan
            </button>
            <button
              className={`mgr-nav-item ${activeTab === 'kitchen-config' ? 'active' : ''}`}
              onClick={() => setActiveTab('kitchen-config')}
            >
              <SlidersIcon /> Kitchen KDS Config
            </button>
          </div>

          <div className="mgr-nav-section">
            <span className="mgr-nav-section-title">MENU & PANTRY</span>
            <button
              className={`mgr-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <TagIcon /> Menu & 86 Catalog
            </button>
            <button
              className={`mgr-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <RotateCcwIcon /> Stock & Inventory
            </button>
          </div>

          <div className="mgr-nav-section">
            <span className="mgr-nav-section-title">PERSONNEL & PROMOS</span>
            <button
              className={`mgr-nav-item ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => setActiveTab('staff')}
            >
              <UsersIcon /> Staff & Shifts
            </button>
            <button
              className={`mgr-nav-item ${activeTab === 'discounts' ? 'active' : ''}`}
              onClick={() => setActiveTab('discounts')}
            >
              <TagIcon /> Discounts & Offers
            </button>
          </div>

          <div className="mgr-nav-section">
            <span className="mgr-nav-section-title">GOVERNANCE & AUDIT</span>
            <button
              className={`mgr-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <BriefcaseIcon /> Z-Reports & Filings
            </button>
            <button
              className={`mgr-nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <MessageSquareIcon /> Guest Feedback
            </button>
            <button
              className={`mgr-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <ShieldCheckIcon /> Immutable Audit Trail
            </button>
            <button
              className={`mgr-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <SlidersIcon /> Restaurant Settings
            </button>
          </div>
        </nav>

        {/* Viewport Content */}
        <main className="mgr-content">
          {activeTab === 'overview' && (
            <ManagerOverviewView
              kpi={kpis}
              hourlySales={hourlySales}
              stations={stations}
              inventory={inventory}
              reviews={INITIAL_MANAGER_REVIEWS}
              onNavigateTab={(tab) => setActiveTab(tab as ManagerTab)}
            />
          )}

          {activeTab === 'sales-analytics' && (
            <SalesRevenueAnalyticsView
              hourlySales={hourlySales}
              categoryShares={categoryShares}
            />
          )}

          {activeTab === 'order-analytics' && <OrderAnalyticsView />}

          {activeTab === 'tables' && (
            <TableLayoutManagementView
              tables={tables}
              onUpdateTables={(updated) => setTables(updated)}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeTab === 'menu' && (
            <MenuManagementView
              inventoryItems={inventory}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryManagementView
              inventory={inventory}
              onUpdateInventory={(updated) => setInventory(updated)}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeTab === 'staff' && (
            <StaffManagementView
              staff={staff}
              onUpdateStaff={(updated) => setStaff(updated)}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeTab === 'kitchen-config' && (
            <KitchenOrderConfigView
              stations={stations}
              onUpdateStations={(updated) => setStations(updated)}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeTab === 'discounts' && (
            <DiscountsOffersView
              offers={offers}
              onUpdateOffers={(updated) => setOffers(updated)}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeTab === 'reports' && <ReportsView onLogAudit={handleLogAudit} />}

          {activeTab === 'feedback' && <CustomerFeedbackView onLogAudit={handleLogAudit} />}

          {activeTab === 'audit' && <AuditActivityView logs={auditLogs} />}

          {activeTab === 'settings' && <RestaurantSettingsView onLogAudit={handleLogAudit} />}
        </main>
      </div>

      {/* Notifications Modal */}
      {isNotificationsOpen && (
        <ManagerNotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          onSendBroadcast={handleSendBroadcast}
        />
      )}

      {/* Manager Profile & Security Modal */}
      {isProfileOpen && (
        <ManagerProfileModal
          profile={profile}
          onClose={() => setIsProfileOpen(false)}
          onUpdatePin={handleUpdatePin}
          onNavigateToView={onNavigateToView}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  ChefHatIcon,
  SearchIcon,
  ShoppingBagIcon,
  BellIcon,
  UserIcon,
  CloseIcon,
  LogOutIcon,
  CheckCircleIcon,
  UtensilsIcon,
  HomeDeliveryIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  FlameIcon,
  SparklesIcon,
  ClockIcon,
  ReceiptIcon,
  CreditCardIcon,
  AlertTriangleIcon,
} from './Icons';
import {
  MOCK_NOTIFICATIONS,
  INITIAL_RESTAURANT_TABLES,
  type RestaurantTable,
  type NotificationItem,
} from '../data/mockRestaurantData';
import { TableBookingPanel } from './TableBookingPanel';

export type OrderType = 'dine-in' | 'delivery';

export type CustomerNavTab = 'home' | 'menu' | 'orders' | 'checkout';

export interface CustomerNavbarProps {
  activeTab: CustomerNavTab;
  onSelectTab: (tab: CustomerNavTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onSwitchToAuth: () => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  tableNumber: string;
  onChangeTableNumber: (table: string) => void;
  deliveryAddress: string;
  onChangeDeliveryAddress: (address: string) => void;
  customerName?: string;
  tables?: RestaurantTable[];
  onBookTable?: (table: RestaurantTable) => void;
  onJoinWaitlist?: (table: RestaurantTable) => void;
  onReleaseTable?: () => void;
  joinedWaitlistIds?: string[];
  notifications?: NotificationItem[];
  onOpenProfile?: () => void;
  onOpenHelp?: () => void;
  onMarkAllNotificationsRead?: () => void;
  onNotificationClick?: (notif: NotificationItem) => void;
}

const PRESET_ADDRESSES = [
  '742 Evergreen Terrace, Apt 4B',
  '100 Financial Tower, Fl 18',
  'Villa 9, Palm Bay Residences',
];

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onSwitchToAuth,
  orderType,
  onChangeOrderType,
  tableNumber,
  onChangeTableNumber,
  deliveryAddress,
  onChangeDeliveryAddress,
  customerName = 'Alexander Vance',
  tables,
  onBookTable,
  onJoinWaitlist,
  onReleaseTable,
  joinedWaitlistIds = [],
  notifications = MOCK_NOTIFICATIONS,
  onOpenProfile,
  onOpenHelp,
  onMarkAllNotificationsRead,
  onNotificationClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showOrderTypeMenu, setShowOrderTypeMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'orders' | 'alerts'>('all');

  const currentTables = tables || INITIAL_RESTAURANT_TABLES;

  const handleSelectTable = (tbl: RestaurantTable) => {
    onChangeTableNumber(tbl.tableNumber);
    if (onBookTable) onBookTable(tbl);
    setShowOrderTypeMenu(false);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === 'orders') {
      return ['accepted', 'preparing', 'ready', 'payment'].includes(n.type);
    }
    if (notifFilter === 'alerts') {
      return ['delayed', 'changes'].includes(n.type);
    }
    return true;
  });

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'accepted':
        return <CheckCircleIcon size={16} className="notif-type-icon green" />;
      case 'preparing':
        return <FlameIcon size={16} className="notif-type-icon orange" />;
      case 'ready':
        return <SparklesIcon size={16} className="notif-type-icon gold" />;
      case 'delayed':
        return <AlertTriangleIcon size={16} className="notif-type-icon yellow" />;
      case 'changes':
        return <ClockIcon size={16} className="notif-type-icon purple" />;
      case 'payment':
        return <CreditCardIcon size={16} className="notif-type-icon blue" />;
      default:
        return <CheckCircleIcon size={16} />;
    }
  };

  return (
    <header className="customer-navbar">
      <div className="nav-container">
        {/* Left: Brand Logo */}
        <div className="nav-left">
          <button
            type="button"
            className="brand-logo-btn"
            onClick={() => onSelectTab('home')}
          >
            <div className="brand-icon-wrapper">
              <ChefHatIcon size={24} />
            </div>
            <div className="brand-text-col">
              <span className="nav-brand-title">SAVORIA</span>
              <span className="nav-brand-sub">Fine Dining RMS</span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="nav-links desktop-only" aria-label="Customer Navigation">
            <button
              type="button"
              className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => onSelectTab('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`nav-link-btn ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => onSelectTab('menu')}
            >
              Menu
            </button>
            <button
              type="button"
              className={`nav-link-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => onSelectTab('orders')}
            >
              Orders
            </button>
            {onOpenHelp && (
              <button
                type="button"
                className="nav-link-btn help-nav-link"
                onClick={onOpenHelp}
              >
                Help & FAQs
              </button>
            )}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="nav-center">
          <div className="nav-search-wrapper">
            <SearchIcon size={16} className="search-icon-svg" />
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search dishes, steaks, pasta, wines..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="nav-right">
          {/* Order Type Selector: DINE-IN ▾ (or DINE-IN • Table XX ▾ after booking, or Home Delivery) */}
          <div className="nav-popover-anchor desktop-only">
            <button
              type="button"
              className={`order-type-trigger-btn ${orderType === 'delivery' ? 'mode-delivery' : 'mode-dinein'} ${orderType === 'dine-in' && !tableNumber ? 'dinein-only' : ''}`}
              onClick={() => {
                setShowOrderTypeMenu(!showOrderTypeMenu);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              aria-label={orderType === 'dine-in' ? 'Table Reservation & Status' : 'Delivery Address'}
              title={orderType === 'dine-in' ? (tableNumber ? `Reserved at ${tableNumber}` : 'Click to reserve a table') : 'Delivery destination'}
            >
              {orderType === 'dine-in' ? (
                !tableNumber ? (
                  <div className="dinein-trigger-simple">
                    <span className="dinein-text-primary">DINE-IN</span>
                    <ChevronDownIcon
                      size={13}
                      className={`order-type-chevron ${showOrderTypeMenu ? 'open' : ''}`}
                    />
                  </div>
                ) : (
                  <div className="dinein-trigger-booked">
                    <span className="dinein-text-primary">DINE-IN</span>
                    <span className="dinein-trigger-dot">•</span>
                    <span className="dinein-table-badge">{tableNumber}</span>
                    <ChevronDownIcon
                      size={13}
                      className={`order-type-chevron ${showOrderTypeMenu ? 'open' : ''}`}
                    />
                  </div>
                )
              ) : (
                <>
                  <div className="order-type-icon-circle">
                    <HomeDeliveryIcon size={15} />
                  </div>

                  <div className="order-type-text-wrap">
                    <span className="order-type-caption">Home Delivery</span>
                    <span className="order-type-subval">{deliveryAddress.split(',')[0]}</span>
                  </div>

                  <ChevronDownIcon
                    size={13}
                    className={`order-type-chevron ${showOrderTypeMenu ? 'open' : ''}`}
                  />
                </>
              )}
            </button>

            {/* Table Booking & Order Type Panel */}
            <TableBookingPanel
              isOpen={showOrderTypeMenu}
              onClose={() => setShowOrderTypeMenu(false)}
              orderType={orderType}
              onChangeOrderType={onChangeOrderType}
              currentTable={tableNumber}
              onSelectTable={handleSelectTable}
              onReleaseTable={onReleaseTable}
              tables={currentTables}
              onJoinWaitlist={(tbl) => {
                if (onJoinWaitlist) onJoinWaitlist(tbl);
              }}
              joinedWaitlistIds={joinedWaitlistIds}
              deliveryAddress={deliveryAddress}
              onChangeDeliveryAddress={onChangeDeliveryAddress}
              presetAddresses={PRESET_ADDRESSES}
            />
          </div>

          {/* Cart Icon Button */}
          <button
            type="button"
            className="action-icon-btn cart-btn"
            onClick={onOpenCart}
            aria-label="View shopping cart"
            title="Shopping Cart"
          >
            <ShoppingBagIcon size={20} />
            {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
          </button>

          {/* Notifications Icon Button */}
          <div className="nav-popover-anchor">
            <button
              type="button"
              className="action-icon-btn notif-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
                setShowOrderTypeMenu(false);
              }}
              aria-label="Notifications"
              title="Notifications"
            >
              <BellIcon size={20} />
              {unreadCount > 0 && <span className="notif-dot-pulse" />}
            </button>

            {/* Enhanced Notifications Dropdown */}
            {showNotifications && (
              <div className="nav-dropdown-menu notif-dropdown">
                <div className="dropdown-header">
                  <div>
                    <h4 className="dropdown-title">Kitchen & Dining Alerts</h4>
                    <span className="dropdown-count">{unreadCount} unread</span>
                  </div>
                  {onMarkAllNotificationsRead && unreadCount > 0 && (
                    <button
                      type="button"
                      className="mark-read-text-btn"
                      onClick={onMarkAllNotificationsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Sub-tabs for notification types */}
                <div className="notif-tabs-filter">
                  <button
                    type="button"
                    className={`notif-filter-btn ${notifFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setNotifFilter('all')}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    className={`notif-filter-btn ${notifFilter === 'orders' ? 'active' : ''}`}
                    onClick={() => setNotifFilter('orders')}
                  >
                    Orders
                  </button>
                  <button
                    type="button"
                    className={`notif-filter-btn ${notifFilter === 'alerts' ? 'active' : ''}`}
                    onClick={() => setNotifFilter('alerts')}
                  >
                    Alerts
                  </button>
                </div>

                <div className="dropdown-list notif-dropdown-list">
                  {filteredNotifs.length === 0 ? (
                    <div className="notif-empty-state">
                      <p>No notifications in this category.</p>
                    </div>
                  ) : (
                    filteredNotifs.map((item) => (
                      <div
                        key={item.id}
                        className={`dropdown-item notif-item ${item.unread ? 'unread' : ''}`}
                        onClick={() => {
                          if (onNotificationClick) onNotificationClick(item);
                        }}
                      >
                        <div className="notif-item-icon">
                          {getNotifIcon(item.type)}
                        </div>
                        <div className="notif-item-body">
                          <div className="notif-title-row">
                            <p className="notif-item-title">{item.title}</p>
                            <span className={`notif-type-tag ${item.type}`}>
                              {item.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="notif-item-desc">{item.message}</p>
                          <span className="notif-item-time">{item.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customer Profile Avatar */}
          <div className="nav-popover-anchor">
            <button
              type="button"
              className="profile-avatar-btn"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowOrderTypeMenu(false);
              }}
              aria-label="Customer Profile Menu"
            >
              <div className="avatar-circle">
                <UserIcon size={16} />
              </div>
              <span className="profile-name desktop-only">{customerName.split(' ')[0]}</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="nav-dropdown-menu profile-dropdown">
                <div className="dropdown-header profile-dropdown-header">
                  <div className="profile-header-avatar">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h4 className="dropdown-title">{customerName}</h4>
                    <p className="profile-table-sub">
                      {orderType === 'dine-in' ? (tableNumber ? `Dining at ${tableNumber}` : 'Dine-In Guest') : 'Home Delivery Guest'}
                    </p>
                  </div>
                </div>

                <div className="profile-dropdown-links">
                  {/* Open Profile Modal */}
                  {onOpenProfile && (
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenProfile();
                      }}
                    >
                      <UserIcon size={15} />
                      <span>My Profile & Preferences</span>
                    </button>
                  )}

                  {/* View Orders */}
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      onSelectTab('orders');
                      setShowProfileMenu(false);
                    }}
                  >
                    <ReceiptIcon size={15} />
                    <span>My Orders & Invoices</span>
                  </button>

                  {/* Help & FAQs */}
                  {onOpenHelp && (
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenHelp();
                      }}
                    >
                      <HelpCircleIcon size={15} />
                      <span>Help, FAQs & Disputes</span>
                    </button>
                  )}

                  <div className="dropdown-divider" />

                  {/* Sign out link */}
                  <button
                    type="button"
                    className="profile-menu-item text-cognac"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSwitchToAuth();
                    }}
                  >
                    <LogOutIcon size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <CloseIcon size={22} /> : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-panel">
          {/* Mobile Order Type Switcher */}
          <div className="mobile-order-type-block">
            <div className="mobile-mode-buttons">
              <button
                type="button"
                className={`mobile-mode-btn ${orderType === 'dine-in' ? 'active' : ''}`}
                onClick={() => onChangeOrderType('dine-in')}
              >
                <UtensilsIcon size={15} />
                <span>Dine-In</span>
              </button>
              <button
                type="button"
                className={`mobile-mode-btn ${orderType === 'delivery' ? 'active' : ''}`}
                onClick={() => onChangeOrderType('delivery')}
              >
                <HomeDeliveryIcon size={15} />
                <span>Delivery</span>
              </button>
            </div>

            {orderType === 'dine-in' ? (
              <div className="mobile-suboption-row">
                <span>Table:</span>
                <button
                  type="button"
                  className="mobile-book-table-trigger-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowOrderTypeMenu(true);
                  }}
                >
                  {tableNumber ? `${tableNumber} • Change Table` : 'DINE-IN ▾ Book Table'}
                </button>
              </div>
            ) : (
              <div className="mobile-suboption-row">
                <span>Deliver to:</span>
                <select
                  value={deliveryAddress}
                  onChange={(e) => onChangeDeliveryAddress(e.target.value)}
                  className="mobile-table-dropdown"
                >
                  {PRESET_ADDRESSES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mobile-nav-links">
            <button
              type="button"
              className={`mobile-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => {
                onSelectTab('home');
                setIsMobileMenuOpen(false);
              }}
            >
              Home
            </button>
            <button
              type="button"
              className={`mobile-link ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => {
                onSelectTab('menu');
                setIsMobileMenuOpen(false);
              }}
            >
              Menu
            </button>
            <button
              type="button"
              className={`mobile-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => {
                onSelectTab('orders');
                setIsMobileMenuOpen(false);
              }}
            >
              Orders & Tracker
            </button>
            {onOpenProfile && (
              <button
                type="button"
                className="mobile-link"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenProfile();
                }}
              >
                My Profile & Preferences
              </button>
            )}
            {onOpenHelp && (
              <button
                type="button"
                className="mobile-link"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenHelp();
                }}
              >
                Help, FAQs & Dispute
              </button>
            )}
            <button
              type="button"
              className="mobile-link text-cognac"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onSwitchToAuth();
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

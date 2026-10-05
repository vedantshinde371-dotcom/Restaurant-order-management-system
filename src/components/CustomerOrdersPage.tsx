import React, { useState } from 'react';
import type { ActiveOrder, TableBooking, BookingStatus } from '../data/mockRestaurantData';
import {
  ClockIcon,
  HomeDeliveryIcon,
  UtensilsIcon,
  ArrowRightIcon,
  SparklesIcon,
  RotateCcwIcon,
  ReceiptIcon,
  StarIcon,
  InfoIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  PrinterIcon,
  Share2Icon,
  UsersGroupIcon,
  MapPinIcon,
  QrCodeIcon,
} from './Icons';

interface CustomerOrdersPageProps {
  orders: ActiveOrder[];
  bookings?: TableBooking[];
  onTrackOrder: (orderId: string) => void;
  onExploreMenu: () => void;
  onViewOrderDetails: (order: ActiveOrder) => void;
  onReorder: (order: ActiveOrder) => void;
  onOpenReceipt: (order: ActiveOrder) => void;
  onRateOrder: (order: ActiveOrder) => void;
  onViewBookingTicket?: (booking: TableBooking) => void;
  onCancelBooking?: (bookingId: string) => void;
  initialTab?: 'orders' | 'bookings';
  onBookNewTable?: () => void;
  onToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

const getOrderStatusText = (order: ActiveOrder): string => {
  const isDelivery =
    order.orderType === 'delivery' ||
    order.tableNumber.toLowerCase().includes('delivery') ||
    order.tableNumber === 'Table 04' ||
    order.id === 'SAV-7080' ||
    !order.tableNumber;

  if (isDelivery) {
    switch (order.currentStep) {
      case 1:
        return 'Order Received';
      case 2:
        return 'Cooking';
      case 3:
        return 'On the Way to Deliver';
      case 4:
        return 'Delivery Received';
      default:
        return 'Order Received';
    }
  }

  // Dine-In
  switch (order.currentStep) {
    case 1:
      return 'Order Received';
    case 2:
      return 'Cooking on Line';
    case 3:
      return 'Plating & Garnishing';
    case 4:
      return 'Delivered to Table';
    default:
      return 'Order Received';
  }
};

export const CustomerOrdersPage: React.FC<CustomerOrdersPageProps> = ({
  orders,
  bookings = [],
  onTrackOrder,
  onExploreMenu,
  onViewOrderDetails,
  onReorder,
  onOpenReceipt,
  onRateOrder,
  onViewBookingTicket,
  onCancelBooking,
  initialTab = 'orders',
  onBookNewTable,
  onToast,
}) => {
  const [selectedSection, setSelectedSection] = useState<'orders' | 'bookings' | null>(null);
  const [lastInitialTab, setLastInitialTab] = useState(initialTab);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'history'>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | BookingStatus>('all');

  if (initialTab !== lastInitialTab) {
    setLastInitialTab(initialTab);
    setSelectedSection(null);
  }

  const mainSection = selectedSection ?? initialTab;
  const setMainSection = (sec: 'orders' | 'bookings') => setSelectedSection(sec);

  const activeOrders = orders.filter((o) => o.currentStep < 4);
  const completedOrders = orders.filter((o) => o.currentStep >= 4);

  const displayedOrders =
    filterTab === 'active'
      ? activeOrders
      : filterTab === 'history'
      ? completedOrders
      : orders;

  // Bookings filtering
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

  const displayedBookings =
    bookingStatusFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.status === bookingStatusFilter);

  const handleShareBooking = (booking: TableBooking) => {
    const text = `🍽️ Table Booking Confirmation\nRestaurant: ${booking.restaurantName}\nRef: ${booking.id}\nTable: ${booking.tableNumber} (${booking.tableZone})\nDate: ${booking.date} at ${booking.time}\nGuests: ${booking.guestsCount}\nStatus: ${booking.status}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (onToast) {
        onToast('Copied to Clipboard', `Booking ${booking.id} details copied.`, 'success');
      }
    }
  };

  return (
    <div className="content-container orders-page-container">
      {/* Header */}
      <div className="orders-page-header">
        <div className="orders-page-title-row">
          <div>
            <div className="orders-tag-pill">
              <SparklesIcon size={14} />
              <span>SAVORIA DINING TICKET & RESERVATIONS LOG</span>
            </div>
            <h1 className="orders-page-title">My Orders & Bookings</h1>
          </div>

          {/* Section Segmented Switcher (Orders vs Bookings) */}
          <div className="orders-section-switcher" role="tablist">
            <button
              type="button"
              className={`section-switcher-btn ${mainSection === 'orders' ? 'active' : ''}`}
              onClick={() => setMainSection('orders')}
            >
              <UtensilsIcon size={14} />
              <span>Food Orders ({orders.length})</span>
            </button>
            <button
              type="button"
              className={`section-switcher-btn ${mainSection === 'bookings' ? 'active' : ''}`}
              onClick={() => setMainSection('bookings')}
            >
              <CalendarIcon size={14} />
              <span>Table Reservations ({bookings.length})</span>
            </button>
          </div>
        </div>

        <p className="orders-page-sub">
          {mainSection === 'orders'
            ? 'Review placed tickets, check real-time kitchen progress, reorder favorites, and download digital invoices.'
            : 'Review your official table reservations, view digital seating passes, download proof tickets, or manage bookings.'}
        </p>

        {/* Filter Tabs for Food Orders */}
        {mainSection === 'orders' ? (
          <div className="orders-filter-tabs-row" role="tablist">
            <button
              type="button"
              className={`orders-filter-tab ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All Orders ({orders.length})
            </button>
            <button
              type="button"
              className={`orders-filter-tab ${filterTab === 'active' ? 'active' : ''}`}
              onClick={() => setFilterTab('active')}
            >
              Active In-Progress ({activeOrders.length})
            </button>
            <button
              type="button"
              className={`orders-filter-tab ${filterTab === 'history' ? 'active' : ''}`}
              onClick={() => setFilterTab('history')}
            >
              Order History ({completedOrders.length})
            </button>
          </div>
        ) : (
          /* Filter Tabs for Table Reservations */
          <div className="orders-filter-tabs-row" role="tablist">
            <button
              type="button"
              className={`orders-filter-tab ${bookingStatusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setBookingStatusFilter('all')}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              type="button"
              className={`orders-filter-tab ${bookingStatusFilter === 'CONFIRMED' ? 'active' : ''}`}
              onClick={() => setBookingStatusFilter('CONFIRMED')}
            >
              <span className="status-dot dot-available" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#10b981', marginRight: 6 }} />
              Confirmed ({confirmedBookings.length})
            </button>
            <button
              type="button"
              className={`orders-filter-tab ${bookingStatusFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setBookingStatusFilter('PENDING')}
            >
              <span className="status-dot dot-waiting" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', marginRight: 6 }} />
              Pending Verification ({pendingBookings.length})
            </button>
            <button
              type="button"
              className={`orders-filter-tab ${bookingStatusFilter === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setBookingStatusFilter('CANCELLED')}
            >
              <span className="status-dot dot-booked" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#ef4444', marginRight: 6 }} />
              Cancelled ({cancelledBookings.length})
            </button>
          </div>
        )}
      </div>

      {/* ======================================================================
         SECTION 1: FOOD ORDERS LIST
         ====================================================================== */}
      {mainSection === 'orders' && (
        <>
          {displayedOrders.length === 0 ? (
            <div className="orders-empty-filter-state">
              <UtensilsIcon size={32} />
              <h4>
                {filterTab === 'active'
                  ? 'No active orders in progress right now'
                  : 'No completed order history found'}
              </h4>
              <p>
                {filterTab === 'active'
                  ? 'All placed orders have been completed. Check "Order History" to view past dining tickets.'
                  : 'Browse our menu to place your first dining order.'}
              </p>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setFilterTab('all')}
                >
                  View All Orders
                </button>
                <button
                  type="button"
                  className="btn btn-cognac btn-sm"
                  onClick={onExploreMenu}
                >
                  <UtensilsIcon size={14} />
                  <span>Explore Menu & Order</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="orders-cards-list">
              {displayedOrders.map((order) => {
                const isDelivery =
                  order.orderType === 'delivery' ||
                  order.tableNumber.toLowerCase().includes('delivery') ||
                  order.tableNumber === 'Table 04' ||
                  order.id === 'SAV-7080' ||
                  !order.tableNumber;
                const statusLabel = getOrderStatusText(order);
                const isCompleted = order.currentStep >= 4;

                return (
                  <article key={order.id} className="customer-order-card">
                    {/* Card Top Row: Order ID, Type badge, Status and Date/Time */}
                    <div className="order-card-top-row">
                      <div className="order-card-id-group">
                        <span className="order-id-label">ORDER ID</span>
                        <h3 className="order-id-val">{order.id}</h3>
                        <span
                          className={`order-type-badge ${
                            isDelivery ? 'delivery' : 'dine-in'
                          }`}
                        >
                          {isDelivery ? (
                            <>
                              <HomeDeliveryIcon size={14} />
                              <span>Home Delivery</span>
                            </>
                          ) : (
                            <>
                              <UtensilsIcon size={14} />
                              <span>Dine-In • {order.tableNumber}</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="order-card-status-col">
                        <span className={`order-status-pill step-${order.currentStep} ${isCompleted ? 'completed' : ''}`}>
                          <span className="status-live-dot" />
                          <span className="status-text">{statusLabel}</span>
                        </span>
                        <div className="order-datetime-row">
                          <ClockIcon size={13} />
                          <span>{order.placedTime || 'Just now'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-card-divider" />

                    {/* Items Summary with portions and customizations */}
                    <div className="order-card-items-wrap">
                      <span className="order-items-heading">
                        Ordered Dishes ({order.items.reduce((s, i) => s + i.quantity, 0)} items):
                      </span>
                      <div className="order-items-list">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item-chip">
                            <span className="item-qty">{item.quantity}×</span>
                            <span className="item-name">{item.name}</span>
                            {item.portion && (
                              <span className="item-portion-caption">({item.portion})</span>
                            )}
                            <span className="item-price">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rating display on card if already rated */}
                    {order.rating && (
                      <div className="order-card-rating-preview">
                        <div className="rating-preview-stars">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon
                              key={s}
                              size={13}
                              className={s <= order.rating!.overall ? 'gold-star' : 'muted-star'}
                            />
                          ))}
                        </div>
                        <span className="rating-preview-text">
                          "{order.rating.comment}"
                        </span>
                      </div>
                    )}

                    <div className="order-card-divider" />

                    {/* Bottom Row: Total & Action Buttons */}
                    <div className="order-card-footer">
                      <div className="order-total-group">
                        <span className="order-total-label">Total Amount</span>
                        <span className="order-total-val">${order.total.toFixed(2)}</span>
                      </div>

                      <div className="order-card-actions-group">
                        {/* View Details button */}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm order-action-btn"
                          onClick={() => onViewOrderDetails(order)}
                          title="View full order breakdown and receipt"
                        >
                          <InfoIcon size={14} />
                          <span>Details</span>
                        </button>

                        {/* Digital Receipt button */}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm order-action-btn"
                          onClick={() => onOpenReceipt(order)}
                          title="View & Print Digital Receipt"
                        >
                          <ReceiptIcon size={14} />
                          <span>Receipt</span>
                        </button>

                        {/* Reorder button */}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm order-action-btn reorder-btn"
                          onClick={() => onReorder(order)}
                          title="Add all items from this order to cart"
                        >
                          <RotateCcwIcon size={14} />
                          <span>Reorder</span>
                        </button>

                        {/* Track Order button (if active) */}
                        {!isCompleted ? (
                          <button
                            type="button"
                            className="btn btn-cognac btn-sm track-order-btn"
                            onClick={() => onTrackOrder(order.id)}
                            aria-label={`Track order ${order.id}`}
                          >
                            <span>Track Order</span>
                            <ArrowRightIcon size={15} />
                          </button>
                        ) : (
                          /* Rate Experience button (if completed) */
                          <button
                            type="button"
                            className={`btn ${order.rating ? 'btn-secondary' : 'btn-cognac'} btn-sm rate-btn`}
                            onClick={() => onRateOrder(order)}
                          >
                            <StarIcon size={14} />
                            <span>{order.rating ? 'Edit Rating' : 'Rate Order'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ======================================================================
         SECTION 2: TABLE RESERVATIONS / BOOKINGS LIST
         ====================================================================== */}
      {mainSection === 'bookings' && (
        <>
          {displayedBookings.length === 0 ? (
            <div className="orders-empty-filter-state">
              <CalendarIcon size={36} />
              <h4>
                {bookingStatusFilter === 'all'
                  ? 'No table reservations recorded yet'
                  : `No ${bookingStatusFilter.toLowerCase()} reservations found`}
              </h4>
              <p>
                Browse our interactive floor map to select your preferred table and receive an official reservation ticket.
              </p>
              {onBookNewTable && (
                <button
                  type="button"
                  className="btn btn-cognac btn-sm"
                  onClick={onBookNewTable}
                >
                  <SparklesIcon size={14} />
                  <span>Reserve a Table Now</span>
                </button>
              )}
            </div>
          ) : (
            <div className="orders-cards-list">
              {displayedBookings.map((booking) => {
                const isConfirmed = booking.status === 'CONFIRMED';
                const isPending = booking.status === 'PENDING';
                const isCancelled = booking.status === 'CANCELLED';

                return (
                  <article key={booking.id} className="customer-order-card customer-booking-card">
                    {/* Top Row: Ref ID, Restaurant Name, Status Badge & Timestamp */}
                    <div className="order-card-top-row">
                      <div className="order-card-id-group">
                        <span className="order-id-label">RESERVATION REF</span>
                        <h3 className="order-id-val" style={{ color: '#e5a962' }}>{booking.id}</h3>
                        <span
                          className={`order-type-badge ${
                            booking.tableLocation.toLowerCase()
                          }`}
                          style={{
                            background: 'rgba(201, 137, 61, 0.15)',
                            borderColor: 'rgba(201, 137, 61, 0.4)',
                            color: '#f5ede4',
                          }}
                        >
                          <MapPinIcon size={13} />
                          <span>{booking.tableLocation} • {booking.tableZone}</span>
                        </span>
                      </div>

                      <div className="order-card-status-col">
                        <span
                          className={`booking-status-badge ${
                            isConfirmed ? 'badge-confirmed' : isPending ? 'badge-pending' : 'badge-cancelled'
                          }`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            background: isConfirmed
                              ? 'rgba(16, 185, 129, 0.18)'
                              : isPending
                              ? 'rgba(245, 158, 11, 0.18)'
                              : 'rgba(239, 68, 68, 0.18)',
                            border: `1px solid ${
                              isConfirmed ? '#10b981' : isPending ? '#f59e0b' : '#ef4444'
                            }`,
                            color: isConfirmed ? '#34d399' : isPending ? '#fbbf24' : '#f87171',
                          }}
                        >
                          {isConfirmed && <CheckCircleIcon size={14} />}
                          {isPending && <ClockIcon size={14} />}
                          {isCancelled && <AlertTriangleIcon size={14} />}
                          <span>{booking.status}</span>
                        </span>

                        <div className="order-datetime-row">
                          <CalendarIcon size={13} />
                          <span>{booking.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-card-divider" />

                    {/* Middle: Table Spotlight & Seating Schedule */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '0.5rem 0' }}>
                      {/* Spotlight Box */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(201, 137, 61, 0.2)',
                          borderRadius: '12px',
                          padding: '0.85rem 1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '10px',
                            background: 'rgba(201, 137, 61, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#e5a962',
                          }}
                        >
                          <UtensilsIcon size={24} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#a89687', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                            ALLOCATED TABLE
                          </span>
                          <h4 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '1.35rem', color: '#f5ede4', margin: '0.1rem 0' }}>
                            {booking.tableNumber}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#c9893d', fontWeight: 600 }}>
                            {booking.tableZone}
                          </span>
                        </div>
                      </div>

                      {/* Date & Time Box */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(201, 137, 61, 0.2)',
                          borderRadius: '12px',
                          padding: '0.85rem 1.1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#f5ede4', fontSize: '0.88rem', fontWeight: 600 }}>
                          <CalendarIcon size={14} className="text-gold" />
                          <span>{booking.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#f5ede4', fontSize: '0.88rem', fontWeight: 600 }}>
                          <ClockIcon size={14} className="text-gold" />
                          <span>Seating Time: {booking.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a89687', fontSize: '0.8rem' }}>
                          <UsersGroupIcon size={14} />
                          <span>Party Size: <strong>{booking.guestsCount} Guests</strong></span>
                        </div>
                      </div>

                      {/* Guest Details Box */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(201, 137, 61, 0.2)',
                          borderRadius: '12px',
                          padding: '0.85rem 1.1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', color: '#a89687', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                          PATRON / GUEST
                        </span>
                        <strong style={{ color: '#f5ede4', fontSize: '0.9rem' }}>{booking.customerName}</strong>
                        {booking.customerPhone && (
                          <span style={{ fontSize: '0.75rem', color: '#a89687' }}>{booking.customerPhone}</span>
                        )}
                        {booking.notes && (
                          <span style={{ fontSize: '0.72rem', color: '#c9893d', fontStyle: 'italic', marginTop: '0.15rem' }}>
                            {booking.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="order-card-divider" />

                    {/* Bottom Row: Verification Info & Actions */}
                    <div className="order-card-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <QrCodeIcon size={18} className="text-gold" />
                        <span style={{ fontSize: '0.75rem', color: '#a89687' }}>
                          Official Restaurant Seating Pass • ID: <strong style={{ color: '#f5ede4' }}>{booking.id}</strong>
                        </span>
                      </div>

                      <div className="order-card-actions-group">
                        {/* View Official Ticket / Proof */}
                        {onViewBookingTicket && (
                          <button
                            type="button"
                            className="btn btn-cognac btn-sm"
                            onClick={() => onViewBookingTicket(booking)}
                            title="Open Official Reservation Ticket & Seating Pass"
                          >
                            <SparklesIcon size={14} />
                            <span>View Ticket Proof</span>
                          </button>
                        )}

                        {/* Print Ticket */}
                        {onViewBookingTicket && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onViewBookingTicket(booking)}
                            title="Print Reservation Confirmation"
                          >
                            <PrinterIcon size={14} />
                            <span>Print / PDF</span>
                          </button>
                        )}

                        {/* Share */}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleShareBooking(booking)}
                          title="Copy details or share"
                        >
                          <Share2Icon size={14} />
                          <span>Share</span>
                        </button>

                        {/* Cancel Booking option (only if not cancelled) */}
                        {!isCancelled && onCancelBooking && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
                            onClick={() => onCancelBooking(booking.id)}
                            title="Release and cancel table booking"
                          >
                            <span>Cancel Booking</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

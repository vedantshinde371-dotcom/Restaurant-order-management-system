import React, { useState, useMemo } from 'react';
import { CustomerNavbar, type OrderType, type CustomerNavTab } from './CustomerNavbar';
import { CartDrawer } from './CartDrawer';
import { CheckoutPage } from './CheckoutPage';
import { CustomerOrdersPage } from './CustomerOrdersPage';
import { FloatingCartBar } from './FloatingCartBar';
import { OrderTrackerSection } from './OrderTrackerSection';
import { FoodDetailsModal } from './FoodDetailsModal';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { FeedbackRatingModal } from './FeedbackRatingModal';
import { ProfileModal } from './ProfileModal';
import { HelpSupportModal } from './HelpSupportModal';
import { TableBookingConfirmationModal } from './TableBookingConfirmationModal';
import {
  CATEGORIES,
  FEATURED_DISHES,
  INITIAL_RESTAURANT_TABLES,
  INITIAL_ACTIVE_ORDER,
  MOCK_ORDER_HISTORY,
  MOCK_NOTIFICATIONS,
  INITIAL_USER_PROFILE,
  INITIAL_TABLE_BOOKINGS,
  type TableBooking,
  type BookingStatus,
  type Dish,
  type CartItem,
  type ActiveOrder,
  type RestaurantTable,
  type DishPortion,
  type SelectedCustomization,
  type OrderRating,
  type NotificationItem,
  type UserProfile,
} from '../data/mockRestaurantData';
import {
  StarIcon,
  ClockIcon,
  PlusIcon,
  UtensilsIcon,
  SparklesIcon,
  FlameIcon,
} from './Icons';
import type { AuthUser } from '../data/authService';

interface CustomerHomePageProps {
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onSwitchToAuth: () => void;
  onToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const CustomerHomePage: React.FC<CustomerHomePageProps> = ({
  currentUser,
  onLogout,
  onSwitchToAuth,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<CustomerNavTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [checkoutLocation, setCheckoutLocation] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  // Initial display shows only "DINE-IN ▾" until customer books a table
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Apt 4B');
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_RESTAURANT_TABLES);
  const [joinedWaitlistIds, setJoinedWaitlistIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(INITIAL_ACTIVE_ORDER);
  const [orders, setOrders] = useState<ActiveOrder[]>([INITIAL_ACTIVE_ORDER, ...MOCK_ORDER_HISTORY]);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // User Profile & Notifications State
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Modal States
  const [selectedDishForDetails, setSelectedDishForDetails] = useState<Dish | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [isFoodDetailsOpen, setIsFoodDetailsOpen] = useState(false);

  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<ActiveOrder | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<ActiveOrder | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const [selectedOrderForRating, setSelectedOrderForRating] = useState<ActiveOrder | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Table Bookings State & Confirmation Modal
  const [tableBookings, setTableBookings] = useState<TableBooking[]>(INITIAL_TABLE_BOOKINGS);
  const [selectedBookingForConfirmation, setSelectedBookingForConfirmation] = useState<TableBooking | null>(null);
  const [isBookingConfirmationOpen, setIsBookingConfirmationOpen] = useState(false);
  const [ordersPageInitialTab, setOrdersPageInitialTab] = useState<'orders' | 'bookings'>('orders');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const customerName = currentUser?.name || userProfile.name;

  const displayedOrders = useMemo(() => {
    return orders;
  }, [orders]);

  // Filter dishes by category and search query
  const filteredDishes = useMemo(() => {
    return FEATURED_DISHES.filter((dish) => {
      const matchesCategory =
        selectedCategory === 'all' || dish.category === selectedCategory;
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.unitPrice ?? item.dish.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  // Order type switcher
  const handleOrderTypeChange = (newType: OrderType) => {
    setOrderType(newType);
    if (newType === 'dine-in') {
      onToast(
        'Dine-In Mode',
        tableNumber ? `Table service active (${tableNumber}).` : 'Dine-In mode active. Click DINE-IN to book your table.',
        'info'
      );
    } else {
      onToast(
        'Home Delivery Mode',
        `Direct courier dispatch selected to ${deliveryAddress.split(',')[0]}.`,
        'info'
      );
    }
  };

  // Table booking handlers
  const handleBookTable = (table: RestaurantTable) => {
    setTables((prev) =>
      prev.map((t) => {
        if (tableNumber && t.tableNumber === tableNumber && t.id !== table.id) {
          return { ...t, status: 'available' };
        }
        if (t.id === table.id) {
          return { ...t, status: 'booked' };
        }
        return t;
      })
    );
    setTableNumber(table.tableNumber);

    // Generate unique booking reference ID
    const bookingId = `BK-SAV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: TableBooking = {
      id: bookingId,
      restaurantName: 'Savoria Restaurant & Cellar',
      tableNumber: table.tableNumber,
      tableLocation: table.location,
      tableZone: table.zone,
      date: 'Tonight, Sep 27, 2026',
      time: '08:30 PM',
      guestsCount: table.capacity,
      customerName: customerName,
      customerPhone: userProfile.phone || '+1 (555) 749-2810',
      customerEmail: currentUser?.email || 'customer@savoria.com',
      status: 'CONFIRMED',
      specialRequests: 'Guaranteed reservation placed via Savoria Dining Portal.',
      createdAt: 'Just now',
      qrCodeValue: `SAVORIA-RES-${bookingId}-CONFIRMED`,
      notes: 'Maître d’ allocated prime seating pass.',
    };

    setTableBookings((prev) => [newBooking, ...prev]);
    setSelectedBookingForConfirmation(newBooking);
    setIsBookingConfirmationOpen(true);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'changes',
      title: 'Table Reservation Confirmed',
      message: `${table.tableNumber} (${table.location} • ${table.capacity} Guests) booked for ${customerName}. Reference: ${bookingId}.`,
      time: 'Just now',
      unread: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    onToast(
      'Table Confirmed',
      `${table.tableNumber} (${table.location} • ${table.capacity} Guests) booked! Reference: ${bookingId}`,
      'success'
    );
  };

  const handleJoinWaitlist = (table: RestaurantTable) => {
    if (joinedWaitlistIds.includes(table.id)) return;
    setJoinedWaitlistIds((prev) => [...prev, table.id]);
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === table.id) {
          return { ...t, waitingCount: (t.waitingCount ?? 0) + 1 };
        }
        return t;
      })
    );

    const waitlistBookingId = `BK-SAV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newWaitlistBooking: TableBooking = {
      id: waitlistBookingId,
      restaurantName: 'Savoria Restaurant & Cellar',
      tableNumber: table.tableNumber,
      tableLocation: table.location,
      tableZone: table.zone,
      date: 'Tonight, Sep 27, 2026',
      time: 'In ~15 mins',
      guestsCount: table.capacity,
      customerName: customerName,
      customerPhone: userProfile.phone || '+1 (555) 749-2810',
      customerEmail: currentUser?.email || 'customer@savoria.com',
      status: 'PENDING',
      specialRequests: `Waitlist queue position #${(table.waitingCount ?? 0) + 1}`,
      createdAt: 'Just now',
      qrCodeValue: `SAVORIA-WAIT-${waitlistBookingId}-PENDING`,
      notes: 'Host stand clearance pending.',
    };
    setTableBookings((prev) => [newWaitlistBooking, ...prev]);

    onToast(
      'Waitlist Joined',
      `You are on the waitlist for ${table.tableNumber} (${table.location}). Recorded as PENDING reservation #${waitlistBookingId}.`,
      'info'
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    const bookingToCancel = tableBookings.find((b) => b.id === bookingId);
    if (!bookingToCancel) return;

    setTableBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' as BookingStatus } : b))
    );

    // If the cancelled booking was the current table, release it
    if (bookingToCancel.tableNumber === tableNumber) {
      setTableNumber('');
    }

    // Set table back to available
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === bookingToCancel.tableNumber ? { ...t, status: 'available' } : t))
    );

    onToast(
      'Reservation Cancelled',
      `Booking ${bookingId} for ${bookingToCancel.tableNumber} has been cancelled and the table released.`,
      'info'
    );
  };

  const handleReleaseTable = () => {
    if (!tableNumber) return;
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, status: 'available' } : t))
    );
    setTableNumber('');
    onToast('Reservation Released', 'Table reservation released. Selector reset.', 'info');
  };

  // Open food details modal for a dish
  const handleOpenFoodDetails = (dish: Dish) => {
    setSelectedDishForDetails(dish);
    setEditingCartItem(null);
    setIsFoodDetailsOpen(true);
  };

  // Open food details modal to edit an existing cart item's customization
  const handleEditCartItemCustomization = (item: CartItem) => {
    setSelectedDishForDetails(item.dish);
    setEditingCartItem(item);
    setIsFoodDetailsOpen(true);
  };

  // Save food item from modal (either new item or updated item)
  const handleSaveFoodDetails = ({
    dish,
    quantity,
    selectedPortion,
    selectedCustomizations,
    specialInstructions,
    unitPrice,
    existingItemId,
  }: {
    dish: Dish;
    quantity: number;
    selectedPortion: DishPortion;
    selectedCustomizations: SelectedCustomization[];
    specialInstructions: string;
    unitPrice: number;
    existingItemId?: string;
  }) => {
    if (existingItemId) {
      // Update existing item
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === existingItemId
            ? {
                ...item,
                quantity,
                selectedPortion,
                selectedCustomizations,
                specialInstructions,
                unitPrice,
              }
            : item
        )
      );
      onToast('Order Item Updated', `Updated options for ${dish.name}.`, 'info');
    } else {
      // Add as new item
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        dish,
        quantity,
        selectedPortion,
        selectedCustomizations,
        specialInstructions,
        unitPrice,
      };
      setCartItems((prev) => [...prev, newItem]);
      onToast(
        'Added to Order',
        `${quantity}× ${dish.name} (${selectedPortion.name}) added to your ${orderType === 'dine-in' ? 'table' : 'delivery'} order.`,
        'success'
      );
    }
  };

  const handleUpdateQuantity = (dishId: string, delta: number, itemId?: string) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          const isTarget = itemId ? item.id === itemId : item.dish.id === dishId;
          if (isTarget) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (dishId: string, itemId?: string) => {
    setCartItems((prev) =>
      prev.filter((item) => (itemId ? item.id !== itemId : item.dish.id !== dishId))
    );
    onToast('Item Removed', 'Removed item from order.', 'info');
  };

  // Cart -> Checkout transition
  const handleProceedToPay = (locationTarget: string, notes: string) => {
    setCheckoutLocation(locationTarget);
    setCheckoutNotes(notes);
    setIsCartOpen(false);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock Payment & Active Order Creation
  const handleConfirmPaymentOrder = (
    paymentMethod: string,
    notes: string,
    receiptDetails?: {
      receiptNumber: string;
      transactionId: string;
      paymentStatus: 'Paid' | 'Authorized' | 'Pending Cash on Delivery';
      packagingFee: number;
    }
  ) => {
    const isDelivery =
      orderType === 'delivery' ||
      paymentMethod === 'Cash on Delivery' ||
      !tableNumber ||
      tableNumber === 'Table 04';
    const target = isDelivery ? deliveryAddress : (tableNumber || checkoutLocation || 'Table 04');

    const newItems = cartItems.map((c) => ({
      dishId: c.dish.id,
      name: c.dish.name,
      quantity: c.quantity,
      price: c.unitPrice ?? c.dish.price,
      portion: c.selectedPortion?.name,
      customizations: c.selectedCustomizations?.map(
        (group) => `${group.groupName}: ${group.optionNames.join(', ')}`
      ),
      specialInstructions: c.specialInstructions,
    }));

    const newSubtotal = cartItems.reduce((s, i) => {
      const p = i.unitPrice ?? i.dish.price;
      return s + p * i.quantity;
    }, 0);

    const serviceOrDelivery = isDelivery ? 3.50 : +(newSubtotal * 0.1).toFixed(2);
    const packaging = isDelivery ? (receiptDetails?.packagingFee ?? 1.50) : 0;
    const newTax = +(newSubtotal * 0.08).toFixed(2);
    const newTotal = +(newSubtotal + serviceOrDelivery + packaging + newTax).toFixed(2);

    const now = new Date();
    const timeFormatted = `Today, ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

    const orderId = `SAV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: ActiveOrder = {
      id: orderId,
      orderType: isDelivery ? 'delivery' : 'dine-in',
      tableNumber: isDelivery ? `Delivery: ${target.split(',')[0]}` : target,
      placedTime: timeFormatted,
      estimatedMinutes: isDelivery ? 35 : 15,
      currentStep: 1, // Received
      statusText: notes
        ? `Kitchen noted: "${notes}" • Payment verified (${paymentMethod}).`
        : isDelivery
        ? `Payment verified (${paymentMethod}). Kitchen preparing dishes for courier dispatch.`
        : `Payment verified (${paymentMethod}). Dishes transmitted to executive grill line.`,
      paymentMethod,
      paymentStatus: receiptDetails?.paymentStatus || 'Paid',
      receiptNumber: receiptDetails?.receiptNumber || `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionId: receiptDetails?.transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      items: newItems,
      subtotal: newSubtotal,
      serviceFee: isDelivery ? 0 : serviceOrDelivery,
      deliveryFee: isDelivery ? serviceOrDelivery : 0,
      packagingFee: packaging,
      tax: newTax,
      total: newTotal,
    };

    setActiveOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
    setTrackingOrderId(newOrder.id);
    setCartItems([]);
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Push new notifications for order acceptance and payment
    const paymentNotif: NotificationItem = {
      id: `notif-${Date.now()}-pay`,
      type: 'payment',
      title: 'Payment Authorization Confirmed',
      message: `Payment of $${newTotal.toFixed(2)} settled via ${paymentMethod}.`,
      time: 'Just now',
      unread: true,
      orderId: newOrder.id,
    };
    const acceptedNotif: NotificationItem = {
      id: `notif-${Date.now()}-acc`,
      type: 'accepted',
      title: 'Order Received & Accepted',
      message: `Kitchen accepted order ${newOrder.id}. Preparation commenced.`,
      time: 'Just now',
      unread: true,
      orderId: newOrder.id,
    };
    setNotifications((prev) => [acceptedNotif, paymentNotif, ...prev]);

    onToast(
      isDelivery ? 'Delivery Order Placed!' : 'Table Order Transmitted!',
      `${newOrder.id} confirmed via ${paymentMethod}. Order logged in your tickets.`,
      'success'
    );
  };

  // Reorder Handler: loads items from an order back into the cart
  const handleReorder = (order: ActiveOrder) => {
    const reloadedCartItems: CartItem[] = order.items.map((item, idx) => {
      // Match with featured dish or fallback
      const matchingDish =
        FEATURED_DISHES.find((d) => d.id === item.dishId || d.name === item.name) ||
        FEATURED_DISHES[0];

      return {
        id: `cart-reorder-${Date.now()}-${idx}`,
        dish: matchingDish,
        quantity: item.quantity,
        selectedPortion: matchingDish.portions[0],
        specialInstructions: item.specialInstructions,
        unitPrice: item.price,
      };
    });

    setCartItems((prev) => [...prev, ...reloadedCartItems]);
    setIsCartOpen(true);
    onToast(
      'Dishes Reordered!',
      `Added ${order.items.length} items from ${order.id} into your cart.`,
      'success'
    );
  };

  // Feedback & Rating Submission
  const handleSubmitRating = (orderId: string, rating: OrderRating) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rating } : o))
    );
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, rating } : null));
    }
    onToast(
      'Review Submitted!',
      `Thank you for rating order ${orderId}. Your feedback has been shared with Executive Chef Marco.`,
      'success'
    );
  };

  // Notification actions
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    onToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    if (notif.orderId) {
      setTrackingOrderId(notif.orderId);
      setActiveTab('orders');
    }
  };

  const handleCallWaiter = () => {
    const currentOrder = displayedOrders.find((o) => o.id === trackingOrderId) || activeOrder;
    const isDelivery =
      currentOrder?.orderType === 'delivery' ||
      orderType === 'delivery' ||
      currentOrder?.tableNumber.toLowerCase().includes('delivery') ||
      currentOrder?.id === 'SAV-7080' ||
      currentOrder?.tableNumber === 'Table 04';

    if (!isDelivery) {
      onToast(
        'Waiter Notified',
        `Server Marco has been alerted to assist at ${tableNumber || 'your dining table'}.`,
        'info'
      );
    } else {
      onToast(
        'Calling Delivery Person',
        'Courier dispatch contacted. Connecting to your delivery driver.',
        'info'
      );
    }
  };

  return (
    <div className="customer-app-root">
      {/* Top Navigation */}
      <CustomerNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onSwitchToAuth={onLogout || onSwitchToAuth}
        orderType={orderType}
        onChangeOrderType={handleOrderTypeChange}
        tableNumber={tableNumber}
        onChangeTableNumber={setTableNumber}
        deliveryAddress={deliveryAddress}
        onChangeDeliveryAddress={setDeliveryAddress}
        customerName={customerName}
        tables={tables}
        onBookTable={handleBookTable}
        onJoinWaitlist={handleJoinWaitlist}
        onReleaseTable={handleReleaseTable}
        joinedWaitlistIds={joinedWaitlistIds}
        notifications={notifications}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onNotificationClick={handleNotificationClick}
      />

      <main className="customer-main-content">
        {/* Welcome Hero Section */}
        {activeTab !== 'orders' && activeTab !== 'checkout' && (
          <section className="customer-welcome-hero">
            <div className="welcome-hero-overlay" />
            <div className="welcome-hero-content">
              <div className="welcome-tag-pill">
                <SparklesIcon size={16} />
                <span>SAVORIA CULINARY DINING EXPERIENCE</span>
              </div>

              <h1 className="welcome-hero-heading">
                Welcome to Savoria, <span className="gold-text">{customerName.split(' ')[0]}</span>
              </h1>
              <p className="welcome-hero-sub">
                Artisanal pasta, prime dry-aged steaks, and crafted cocktail pairings.
              </p>

              {/* Special Tasting Banner */}
              <div className="daily-special-banner">
                <div className="special-banner-left">
                  <div className="special-badge">
                    <FlameIcon size={16} />
                    <span>TONIGHT'S CHEF SPECIAL</span>
                  </div>
                  <h3>35-Day Dry-Aged Tomahawk & Périgord Truffle Tagliatelle</h3>
                  <p>Includes sommelier pairing recommendation of 2019 Barolo Riserva.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-cognac btn-sm"
                  onClick={() => handleOpenFoodDetails(FEATURED_DISHES[0])}
                >
                  Explore & Customize Special
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Dedicated Checkout & Payment Page */}
        {activeTab === 'checkout' && (
          <CheckoutPage
            items={cartItems}
            orderType={orderType}
            tableNumber={tableNumber || checkoutLocation || 'Table 04'}
            deliveryAddress={deliveryAddress}
            kitchenNotes={checkoutNotes}
            onConfirmOrder={handleConfirmPaymentOrder}
            onBackToMenu={() => setActiveTab('menu')}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* Customer Orders Page & Live Order Tracking */}
        {activeTab === 'orders' && (
          <>
            {trackingOrderId ? (
              <div className="content-container">
                <div className="tracking-back-row">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm back-to-orders-btn"
                    onClick={() => setTrackingOrderId(null)}
                  >
                    <span>← Back to My Orders</span>
                  </button>
                </div>
                {(() => {
                  const trackingOrder =
                    displayedOrders.find((o) => o.id === trackingOrderId) || activeOrder;
                  if (!trackingOrder) return null;
                  return (
                    <OrderTrackerSection
                      order={trackingOrder}
                      orderType={
                        trackingOrder.orderType ||
                        (trackingOrder.tableNumber === 'Table 04' ? 'delivery' : orderType)
                      }
                      onCallWaiter={handleCallWaiter}
                      onBrowseMenu={() => setActiveTab('menu')}
                      onStepAdvance={(step) => {
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === trackingOrder.id ? { ...o, currentStep: step } : o
                          )
                        );
                        if (activeOrder && activeOrder.id === trackingOrder.id) {
                          setActiveOrder((prev) =>
                            prev ? { ...prev, currentStep: step } : null
                          );
                        }
                      }}
                    />
                  );
                })()}
              </div>
            ) : (
              <CustomerOrdersPage
                orders={displayedOrders}
                bookings={tableBookings}
                onTrackOrder={(orderId) => {
                  setTrackingOrderId(orderId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExploreMenu={() => setActiveTab('menu')}
                onViewOrderDetails={(order) => {
                  setSelectedOrderForDetails(order);
                  setIsOrderDetailsOpen(true);
                }}
                onReorder={handleReorder}
                onOpenReceipt={(order) => {
                  setSelectedOrderForReceipt(order);
                  setIsReceiptOpen(true);
                }}
                onRateOrder={(order) => {
                  setSelectedOrderForRating(order);
                  setIsRatingModalOpen(true);
                }}
                onViewBookingTicket={(booking) => {
                  setSelectedBookingForConfirmation(booking);
                  setIsBookingConfirmationOpen(true);
                }}
                onCancelBooking={handleCancelBooking}
                initialTab={ordersPageInitialTab}
                onToast={onToast}
              />
            )}
          </>
        )}

        {/* Menu & Featured Dishes Section */}
        {activeTab !== 'orders' && activeTab !== 'checkout' && (
          <section className="content-container menu-section" id="menu-section">
            <div className="section-header-row">
              <div>
                <span className="section-eyebrow">SAVORIA FLAVORS</span>
                <h2 className="section-title">
                  {selectedCategory === 'all'
                    ? 'Featured Dishes & Chef Signatures'
                    : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </h2>
              </div>
              <span className="dishes-found-count">
                Showing {filteredDishes.length} {filteredDishes.length === 1 ? 'dish' : 'dishes'}
              </span>
            </div>

            {/* Food Categories Selector */}
            <div className="categories-filter-bar" role="tablist" aria-label="Food Categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                >
                  <UtensilsIcon size={15} />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            {filteredDishes.length === 0 ? (
              <div className="empty-dishes-state">
                <UtensilsIcon size={36} />
                <h3>No culinary creations match your search</h3>
                <p>Try searching for steaks, pasta, chocolate, or reset your category filter.</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  Reset Menu Filters
                </button>
              </div>
            ) : (
              <div className="dishes-grid">
                {filteredDishes.map((dish) => {
                  const inCartItem = cartItems.find((i) => i.dish.id === dish.id);

                  return (
                    <article
                      key={dish.id}
                      className="dish-card clickable-dish-card"
                      onClick={() => handleOpenFoodDetails(dish)}
                      title="Click to view ingredients & customize"
                    >
                      <div className="dish-image-wrapper">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="dish-img"
                          loading="lazy"
                        />
                        {dish.badge && <span className="dish-badge-tag">{dish.badge}</span>}
                        {dish.isVegetarian && (
                          <span className="dish-veg-badge" title="Vegetarian">
                            🌱 Veg
                          </span>
                        )}
                      </div>

                      <div className="dish-content">
                        <div className="dish-meta-row">
                          <span className="dish-rating">
                            <StarIcon size={14} />
                            <strong>{dish.rating}</strong> ({dish.reviewsCount})
                          </span>
                          <span className="dish-prep-time">
                            <ClockIcon size={14} />
                            {dish.prepTimeMinutes} mins
                          </span>
                        </div>

                        <h3 className="dish-title">{dish.name}</h3>
                        <p className="dish-description">{dish.description}</p>

                        <div className="dish-card-bottom">
                          <div className="dish-price-group">
                            <span className="price-currency">$</span>
                            <span className="price-val">{dish.price.toFixed(2)}</span>
                          </div>

                          <button
                            type="button"
                            className={`btn ${
                              inCartItem ? 'btn-cognac-outline' : 'btn-cognac'
                            } btn-add-cart`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFoodDetails(dish);
                            }}
                          >
                            <PlusIcon size={15} />
                            <span>{inCartItem ? `Added (${inCartItem.quantity})` : 'Customize & Add'}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Floating View Cart Bar */}
      <FloatingCartBar
        itemCount={cartTotalItems}
        totalAmount={cartTotalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onCheckout={() =>
          handleProceedToPay(
            orderType === 'dine-in' ? tableNumber || 'Table 04' : deliveryAddress,
            checkoutNotes
          )
        }
        isVisible={cartTotalItems > 0 && !isCartOpen && activeTab !== 'checkout'}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onEditCustomization={handleEditCartItemCustomization}
        onProceedToPay={handleProceedToPay}
        currentTable={tableNumber}
        orderType={orderType}
        deliveryAddress={deliveryAddress}
        onSelectTable={setTableNumber}
        onSelectAddress={setDeliveryAddress}
      />

      {/* Food Details & Customization Modal */}
      <FoodDetailsModal
        isOpen={isFoodDetailsOpen}
        onClose={() => {
          setIsFoodDetailsOpen(false);
          setSelectedDishForDetails(null);
          setEditingCartItem(null);
        }}
        dish={selectedDishForDetails}
        initialCartItem={editingCartItem}
        onSaveItem={handleSaveFoodDetails}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isOrderDetailsOpen}
        onClose={() => {
          setIsOrderDetailsOpen(false);
          setSelectedOrderForDetails(null);
        }}
        order={selectedOrderForDetails}
        onReorder={handleReorder}
        onTrackOrder={(orderId) => {
          setIsOrderDetailsOpen(false);
          setTrackingOrderId(orderId);
          setActiveTab('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReceipt={(order) => {
          setIsOrderDetailsOpen(false);
          setSelectedOrderForReceipt(order);
          setIsReceiptOpen(true);
        }}
        onRateOrder={(order) => {
          setIsOrderDetailsOpen(false);
          setSelectedOrderForRating(order);
          setIsRatingModalOpen(true);
        }}
      />

      {/* Digital Receipt Modal */}
      <DigitalReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false);
          setSelectedOrderForReceipt(null);
        }}
        order={selectedOrderForReceipt}
        onTrackOrder={(orderId) => {
          setIsReceiptOpen(false);
          setTrackingOrderId(orderId);
          setActiveTab('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Feedback & Rating Modal */}
      <FeedbackRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setSelectedOrderForRating(null);
        }}
        order={selectedOrderForRating}
        onSubmitRating={handleSubmitRating}
      />

      {/* Profile & Preferences Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
        onLogout={onSwitchToAuth}
        onSelectActiveDeliveryAddress={(addr) => setDeliveryAddress(addr)}
      />

      {/* Help & Support Modal */}
      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        orders={displayedOrders}
        onReportSubmitted={(ticketId) => {
          onToast(
            'Dispute Ticket Submitted',
            `Support Ticket #${ticketId} created. Floor manager Laurent Mercier alerted.`,
            'info'
          );
        }}
      />

      {/* Table Booking Official Confirmation & Proof Ticket Modal */}
      <TableBookingConfirmationModal
        isOpen={isBookingConfirmationOpen}
        onClose={() => setIsBookingConfirmationOpen(false)}
        booking={selectedBookingForConfirmation}
        onViewBooking={() => {
          setIsBookingConfirmationOpen(false);
          setOrdersPageInitialTab('bookings');
          setActiveTab('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onToast={onToast}
      />
    </div>
  );
};

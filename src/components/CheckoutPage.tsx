import React, { useState } from 'react';
import {
  CreditCardIcon,
  ShieldCheckIcon,
  UtensilsIcon,
  HomeDeliveryIcon,
  CashierIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PrinterIcon,
  ChefHatIcon,
} from './Icons';
import type { CartItem } from '../data/mockRestaurantData';
import type { OrderType } from './CustomerNavbar';

interface CheckoutPageProps {
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress: string;
  kitchenNotes?: string;
  onConfirmOrder: (
    paymentMethod: string,
    notes: string,
    receiptDetails?: {
      receiptNumber: string;
      transactionId: string;
      paymentStatus: 'Paid' | 'Authorized' | 'Pending Cash on Delivery';
      packagingFee: number;
    }
  ) => void;
  onBackToMenu: () => void;
  onOpenCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  orderType,
  tableNumber,
  deliveryAddress,
  kitchenNotes = '',
  onConfirmOrder,
  onBackToMenu,
  onOpenCart,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'digital' | 'cash_on_delivery'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [cardHolder, setCardHolder] = useState('Alexander Vance');
  const [notes, setNotes] = useState(kitchenNotes);

  // Payment Status lifecycle: 'idle' | 'authorizing' | 'success'
  const [paymentStage, setPaymentStage] = useState<'idle' | 'validating' | 'authorizing' | 'success'>('idle');
  const [confirmedReceipt, setConfirmedReceipt] = useState<{
    receiptNumber: string;
    transactionId: string;
    paymentMethodLabel: string;
    paymentStatus: 'Paid' | 'Authorized' | 'Pending Cash on Delivery';
    placedTime: string;
  } | null>(null);

  const subtotal = items.reduce((sum, item) => {
    const price = item.unitPrice ?? item.dish.price;
    return sum + price * item.quantity;
  }, 0);

  const serviceCharge = orderType === 'dine-in' ? +(subtotal * 0.1).toFixed(2) : 0;
  const deliveryFee = orderType === 'delivery' ? 3.50 : 0;
  const packagingFee = orderType === 'delivery' ? 1.50 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const grandTotal = +(subtotal + serviceCharge + deliveryFee + packagingFee + tax).toFixed(2);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrderClick = () => {
    if (items.length === 0) return;

    // Simulate multi-stage payment verification
    setPaymentStage('validating');

    setTimeout(() => {
      setPaymentStage('authorizing');

      setTimeout(() => {
        const methodLabel =
          paymentMethod === 'card'
            ? 'Credit Card (•••• 4242)'
            : paymentMethod === 'digital'
            ? 'Apple Pay / Digital Wallet'
            : 'Cash on Delivery';

        const statusLabel =
          paymentMethod === 'cash_on_delivery'
            ? 'Pending Cash on Delivery'
            : 'Paid';

        const randNum = Math.floor(100000 + Math.random() * 900000);
        const receiptNo = `REC-${randNum}`;
        const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
        const now = new Date();
        const timeFormatted = `Today, ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

        setConfirmedReceipt({
          receiptNumber: receiptNo,
          transactionId: txnId,
          paymentMethodLabel: methodLabel,
          paymentStatus: statusLabel,
          placedTime: timeFormatted,
        });

        setPaymentStage('success');
      }, 700);
    }, 600);
  };

  const handleProceedToTracking = () => {
    if (!confirmedReceipt) return;
    onConfirmOrder(confirmedReceipt.paymentMethodLabel, notes, {
      receiptNumber: confirmedReceipt.receiptNumber,
      transactionId: confirmedReceipt.transactionId,
      paymentStatus: confirmedReceipt.paymentStatus,
      packagingFee,
    });
  };

  if (items.length === 0 && !confirmedReceipt) {
    return (
      <div className="content-container checkout-page-container">
        <div className="checkout-empty-state">
          <div className="checkout-empty-icon">
            <UtensilsIcon size={38} />
          </div>
          <h2>Your Cart is Empty</h2>
          <p>You need to add at least one dish or cocktail to proceed through checkout.</p>
          <button
            type="button"
            className="btn btn-cognac"
            onClick={onBackToMenu}
          >
            <span>Browse Full Menu</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    );
  }

  // If payment succeeded, show the Digital Receipt View
  if (paymentStage === 'success' && confirmedReceipt) {
    return (
      <div className="content-container checkout-receipt-container">
        {/* Payment Confirmation Banner */}
        <div className="payment-confirmed-banner">
          <div className="confirmed-icon-circle">
            <CheckCircleIcon size={32} />
          </div>
          <div>
            <span className="confirmed-tag">PAYMENT VERIFIED & CONFIRMED</span>
            <h2 className="confirmed-title">Thank You! Your Order Has Been Placed</h2>
            <p className="confirmed-sub">
              Your ticket has been sent to the SAVORIA kitchen line. Review your digital receipt below.
            </p>
          </div>
        </div>

        {/* Paper Digital Receipt */}
        <div className="receipt-paper-card">
          <div className="receipt-paper-header">
            <div className="receipt-brand-mark">
              <ChefHatIcon size={24} />
              <span className="brand-name">SAVORIA</span>
            </div>
            <p className="brand-sub">FINE DINING RMS • OFFICIAL DIGITAL RECEIPT</p>
            <p className="brand-address">
              450 Grand Boulevard, Culinary Arts District, New York, NY 10013
            </p>
          </div>

          <div className="receipt-paper-divider dashed" />

          <div className="receipt-meta-grid">
            <div className="receipt-meta-row">
              <span className="meta-label">Receipt Number:</span>
              <strong className="meta-value">{confirmedReceipt.receiptNumber}</strong>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Transaction ID:</span>
              <span className="meta-value code-font">{confirmedReceipt.transactionId}</span>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Timestamp:</span>
              <span className="meta-value">{confirmedReceipt.placedTime}</span>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Service Type:</span>
              <span className="meta-value">
                {orderType === 'delivery' ? 'Home Delivery Dispatch' : `Dine-In • ${tableNumber || 'Table 04'}`}
              </span>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Destination:</span>
              <span className="meta-value">
                {orderType === 'delivery' ? deliveryAddress : (tableNumber || 'Table 04')}
              </span>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Payment Status:</span>
              <span className="meta-value status-paid">
                ✓ {confirmedReceipt.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="receipt-paper-divider dashed" />

          {/* Line items */}
          <div className="receipt-items-table">
            <div className="receipt-items-header">
              <span className="col-desc">Artisanal Dish</span>
              <span className="col-qty">Qty</span>
              <span className="col-total">Line Total</span>
            </div>

            <div className="receipt-items-body">
              {items.map((item, idx) => {
                const itemPrice = item.unitPrice ?? item.dish.price;
                return (
                  <div key={idx} className="receipt-item-entry">
                    <div className="receipt-item-main">
                      <span className="item-title">{item.dish.name}</span>
                      <span className="item-qty-val">× {item.quantity}</span>
                      <span className="item-total-val">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {(item.selectedPortion || (item.selectedCustomizations && item.selectedCustomizations.length > 0)) && (
                      <div className="receipt-item-subtext">
                        {item.selectedPortion && (
                          <span className="portion-note">{item.selectedPortion.name}</span>
                        )}
                        {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                          <span className="custom-note">
                            ({item.selectedCustomizations.map((c) => c.optionNames.join(', ')).join(' • ')})
                          </span>
                        )}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="receipt-item-instructions">
                        Note: "{item.specialInstructions}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="receipt-paper-divider dashed" />

          {/* Totals */}
          <div className="receipt-totals-section">
            <div className="total-row">
              <span>Items Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {orderType === 'dine-in' ? (
              <div className="total-row">
                <span>Dine-In Service Charge (10%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="total-row">
                  <span>Courier Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Artisanal Eco-Packaging Fee</span>
                  <span>${packagingFee.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="total-row">
              <span>State & Hospitality Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="receipt-paper-divider solid" />

            <div className="total-row grand-total-row">
              <span>GRAND TOTAL</span>
              <span className="grand-total-val">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-paper-divider dashed" />

          <div className="receipt-payment-info">
            <div className="pay-line">
              <span className="label">Settled via:</span>
              <span className="val">{confirmedReceipt.paymentMethodLabel}</span>
            </div>
            <div className="pay-line">
              <span className="label">Verification:</span>
              <span className="val code-font">256-BIT SSL ENCRYPTED GATEWAY</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="receipt-actions-footer">
          <button
            type="button"
            className="btn btn-secondary btn-lg print-receipt-btn"
            onClick={() => window.print()}
          >
            <PrinterIcon size={16} />
            <span>Print / Save Receipt PDF</span>
          </button>

          <button
            type="button"
            className="btn btn-cognac btn-lg track-order-proceed-btn"
            onClick={handleProceedToTracking}
          >
            <span>Proceed to Live Order Tracking</span>
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container checkout-page-container">
      {/* Top Navigation Bar / Breadcrumb */}
      <div className="checkout-page-topbar">
        <div className="checkout-breadcrumbs">
          <button type="button" className="breadcrumb-link" onClick={onBackToMenu}>
            Home
          </button>
          <span className="breadcrumb-separator">/</span>
          <button type="button" className="breadcrumb-link" onClick={onOpenCart}>
            Cart ({totalItemCount})
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Checkout & Payment</span>
        </div>

        <div className="checkout-top-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onOpenCart}>
            <span>Edit Cart</span>
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onBackToMenu}>
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="checkout-page-header">
        <span className="checkout-page-eyebrow">FINAL STEP • ORDER CONFIRMATION</span>
        <h1 className="checkout-page-title">Checkout & Payment</h1>
        <p className="checkout-page-subtitle">
          {orderType === 'delivery'
            ? `Home Delivery Dispatch to ${deliveryAddress.split(',')[0]}`
            : 'Select your preferred payment method and place your order'}
        </p>
      </div>

      {/* Main Checkout Layout Grid */}
      <div className="checkout-page-grid">
        {/* Left Column: Details & Payment Method */}
        <div className="checkout-details-column">
          {/* Home Delivery Destination Details */}
          {orderType === 'delivery' && (
            <section className="checkout-card-section" aria-label="Delivery Details">
              <div className="checkout-card-header">
                <div className="checkout-card-icon-badge">
                  <HomeDeliveryIcon size={18} />
                </div>
                <div>
                  <h3 className="checkout-card-title">Home Delivery Destination</h3>
                  <span className="checkout-card-tag">Courier Dispatch Assigned</span>
                </div>
              </div>

              <div className="checkout-card-body">
                <div className="destination-info-grid">
                  <div className="info-cell full-width">
                    <span className="info-cell-label">Delivery Address:</span>
                    <strong className="info-cell-val">{deliveryAddress}</strong>
                  </div>
                  <div className="info-cell">
                    <span className="info-cell-label">Delivery Fee:</span>
                    <span className="info-cell-val gold-highlight">$3.50 (Courier Express)</span>
                  </div>
                  <div className="info-cell">
                    <span className="info-cell-label">Estimated Delivery:</span>
                    <span className="info-cell-val">30 - 40 Minutes</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Payment Method Selector */}
          <section className="checkout-card-section" aria-label="Payment Method Selection">
            <h3 className="checkout-section-title">Select Payment Method</h3>
            <p className="checkout-section-desc">
              Choose how you would like to settle this dining ticket. (Mock payment simulated)
            </p>

            <div className="payment-method-selector-list">
              {/* Option 1: Credit / Debit Card */}
              <button
                type="button"
                className={`payment-option-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="pay-radio-circle">
                  <span className="radio-inner-dot" />
                </div>
                <div className="pay-option-content">
                  <div className="pay-option-title-row">
                    <CreditCardIcon size={18} />
                    <span className="pay-option-name">Credit / Debit Card</span>
                    <span className="pay-tag-badge">Popular</span>
                  </div>
                  <p className="pay-option-desc">
                    Visa, Mastercard, American Express instant mock authorization
                  </p>
                </div>
              </button>

              {/* Option 2: Apple Pay / Digital Wallet */}
              <button
                type="button"
                className={`payment-option-card ${paymentMethod === 'digital' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('digital')}
              >
                <div className="pay-radio-circle">
                  <span className="radio-inner-dot" />
                </div>
                <div className="pay-option-content">
                  <div className="pay-option-title-row">
                    <span className="pay-digital-logo"> / G</span>
                    <span className="pay-option-name">Apple Pay / Google Pay</span>
                    <span className="pay-tag-badge">Instant</span>
                  </div>
                  <p className="pay-option-desc">
                    1-Click secure biometric checkout from your mobile device or browser
                  </p>
                </div>
              </button>

              {/* Option 3: Cash on Delivery */}
              <button
                type="button"
                className={`payment-option-card ${paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash_on_delivery')}
              >
                <div className="pay-radio-circle">
                  <span className="radio-inner-dot" />
                </div>
                <div className="pay-option-content">
                  <div className="pay-option-title-row">
                    <CashierIcon size={18} />
                    <span className="pay-option-name">Cash on Delivery</span>
                    <span className="pay-tag-badge">Cash</span>
                  </div>
                  <p className="pay-option-desc">
                    Pay with physical cash upon receiving your order
                  </p>
                </div>
              </button>
            </div>

            {/* Mock Credit Card Form Fields */}
            {paymentMethod === 'card' && (
              <div className="mock-credit-card-panel">
                <div className="card-panel-header">
                  <span className="card-panel-tag">MOCK CARD TRANSACTION</span>
                  <div className="card-brand-pills">
                    <span className="brand-pill">VISA</span>
                    <span className="brand-pill">MC</span>
                    <span className="brand-pill">AMEX</span>
                  </div>
                </div>

                <div className="card-fields-grid">
                  <div className="card-field-group">
                    <label htmlFor="card-name" className="card-field-label">Cardholder Full Name</label>
                    <input
                      id="card-name"
                      type="text"
                      className="card-field-input"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Alexander Vance"
                    />
                  </div>

                  <div className="card-field-group">
                    <label htmlFor="card-num" className="card-field-label">Card Number</label>
                    <div className="card-input-wrap">
                      <CreditCardIcon size={16} className="card-input-prefix-icon" />
                      <input
                        id="card-num"
                        type="text"
                        className="card-field-input with-icon"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 4242"
                      />
                    </div>
                  </div>

                  <div className="card-field-row-split">
                    <div className="card-field-group">
                      <label htmlFor="card-exp" className="card-field-label">Expires</label>
                      <input
                        id="card-exp"
                        type="text"
                        className="card-field-input"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="card-field-group">
                      <label htmlFor="card-cvv" className="card-field-label">CVV Code</label>
                      <input
                        id="card-cvv"
                        type="text"
                        className="card-field-input"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions Field */}
            <div className="checkout-notes-container">
              <label htmlFor="order-notes" className="checkout-notes-label">
                Special Kitchen / Dietary Instructions
              </label>
              <textarea
                id="order-notes"
                className="checkout-notes-input"
                rows={2}
                placeholder={
                  orderType === 'dine-in'
                    ? 'E.g., Steaks medium-rare, allergy alerts, bring wine with starters...'
                    : 'E.g., Ring buzzer #402, leave at front door, extra napkins...'
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="checkout-security-guarantee">
              <ShieldCheckIcon size={16} />
              <span>
                256-Bit SSL Mock Gateway • Safe sandbox environment, no real bank charge
              </span>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="checkout-summary-column">
          <div className="checkout-sticky-summary">
            <div className="summary-header-row">
              <h3 className="summary-title">Order Summary</h3>
              <span className="summary-badge">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
            </div>

            {/* Ordered Items List */}
            <div className="summary-dishes-list">
              {items.map((item, idx) => {
                const itemPrice = item.unitPrice ?? item.dish.price;
                return (
                  <div key={idx} className="summary-dish-card">
                    <img src={item.dish.image} alt={item.dish.name} className="summary-dish-image" />
                    <div className="summary-dish-details">
                      <span className="dish-name">{item.dish.name}</span>
                      {item.selectedPortion && (
                        <span className="dish-portion-caption">{item.selectedPortion.name}</span>
                      )}
                      {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                        <span className="dish-custom-caption">
                          {item.selectedCustomizations.map((c) => c.optionNames.join(', ')).join(' • ')}
                        </span>
                      )}
                      <span className="dish-qty-price">
                        Qty: {item.quantity} × ${itemPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="dish-line-total">
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="summary-totals-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {orderType === 'dine-in' ? (
                <div className="breakdown-row">
                  <span>Dine-In Service Charge (10%)</span>
                  <span>${serviceCharge.toFixed(2)}</span>
                </div>
              ) : (
                <>
                  <div className="breakdown-row">
                    <span>Courier Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Artisanal Eco-Packaging Fee</span>
                    <span>${packagingFee.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="breakdown-row">
                <span>State & Hospitality Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="breakdown-divider" />

              <div className="breakdown-row grand-total-row">
                <div>
                  <span className="grand-total-label">Final Total</span>
                  <span className="grand-total-sub">All taxes & charges included</span>
                </div>
                <span className="grand-total-price">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Status Indicator / Processing */}
            {paymentStage !== 'idle' && (
              <div className="checkout-payment-status-box">
                {paymentStage === 'validating' && (
                  <div className="status-flow-item">
                    <span className="spinner" />
                    <span>Verifying secure TLS connection & items...</span>
                  </div>
                )}
                {paymentStage === 'authorizing' && (
                  <div className="status-flow-item">
                    <span className="spinner" />
                    <span>Authorizing ${grandTotal.toFixed(2)} with Mock Gateway...</span>
                  </div>
                )}
              </div>
            )}

            {/* "Place Order" CTA Button */}
            <button
              type="button"
              className="btn btn-cognac btn-block btn-lg place-order-btn"
              onClick={handlePlaceOrderClick}
              disabled={paymentStage !== 'idle'}
            >
              {paymentStage !== 'idle' ? (
                <span className="place-order-processing">
                  <span className="spinner" />
                  <span>Processing Payment...</span>
                </span>
              ) : (
                <div className="place-order-content">
                  <span className="place-order-text">Place Order</span>
                  <span className="place-order-tag">${grandTotal.toFixed(2)}</span>
                  <ArrowRightIcon size={18} />
                </div>
              )}
            </button>

            <p className="summary-disclaimer">
              By clicking "Place Order", your ticket is immediately transmitted to the restaurant kitchen. A digital receipt will be generated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

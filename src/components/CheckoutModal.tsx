import React, { useState } from 'react';
import {
  CloseIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UtensilsIcon,
  HomeDeliveryIcon,
} from './Icons';
import type { CartItem } from '../data/mockRestaurantData';
import type { OrderType } from './CustomerNavbar';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  deliveryAddress: string;
  kitchenNotes?: string;
  onConfirmOrder: (paymentMethod: string, notes: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  tableNumber,
  deliveryAddress,
  kitchenNotes = '',
  onConfirmOrder,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'digital' | 'table_cash'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [cardHolder, setCardHolder] = useState('Alexander Vance');
  const [notes, setNotes] = useState(kitchenNotes);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const serviceCharge = orderType === 'dine-in' ? +(subtotal * 0.1).toFixed(2) : 0;
  const deliveryFee = orderType === 'delivery' ? 3.50 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const grandTotal = +(subtotal + serviceCharge + deliveryFee + tax).toFixed(2);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrderClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const methodLabel =
        paymentMethod === 'card'
          ? 'Credit Card (•••• 4242)'
          : paymentMethod === 'digital'
          ? 'Apple Pay / Digital Wallet'
          : orderType === 'dine-in'
          ? 'Pay at Table'
          : 'Cash on Delivery';
      onConfirmOrder(methodLabel, notes);
    }, 850);
  };

  return (
    <div className="checkout-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="checkout-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="checkout-header">
          <div className="checkout-header-left">
            <span className="checkout-eyebrow">FINAL STEP</span>
            <h2 className="checkout-title">Review & Secure Payment</h2>
            <p className="checkout-sub">
              {orderType === 'dine-in'
                ? `Table Service Checkout (${tableNumber || 'Table pending confirmation'})`
                : `Home Delivery Dispatch to ${deliveryAddress.split(',')[0]}`}
            </p>
          </div>
          <button
            type="button"
            className="checkout-close-btn"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="checkout-grid-body">
          {/* Left Column: Dining/Delivery info & Payment Method */}
          <div className="checkout-left-col">
            {/* Dining / Delivery Context Card */}
            <div className="checkout-destination-card">
              <div className="dest-card-header">
                <div className="dest-icon-badge">
                  {orderType === 'dine-in' ? (
                    <UtensilsIcon size={18} />
                  ) : (
                    <HomeDeliveryIcon size={18} />
                  )}
                </div>
                <div>
                  <h4 className="dest-title">
                    {orderType === 'dine-in' ? 'Dine-In Information' : 'Home Delivery Destination'}
                  </h4>
                  <span className="dest-tag">
                    {orderType === 'dine-in' ? 'Dining Room Service' : 'Doorstep Courier'}
                  </span>
                </div>
              </div>

              <div className="dest-details-row">
                {orderType === 'dine-in' ? (
                  <>
                    <div className="dest-detail-item">
                      <span className="dest-detail-label">Assigned Table:</span>
                      <strong className="dest-detail-val gold-highlight">
                        {tableNumber || 'Table 04 (Main Dining Hall)'}
                      </strong>
                    </div>
                    <div className="dest-detail-item">
                      <span className="dest-detail-label">Server Station:</span>
                      <span className="dest-detail-val">Marco (Captain Server)</span>
                    </div>
                    <div className="dest-detail-item">
                      <span className="dest-detail-label">Service Fee:</span>
                      <span className="dest-detail-val">10% (${serviceCharge.toFixed(2)})</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dest-detail-item">
                      <span className="dest-detail-label">Delivery Address:</span>
                      <strong className="dest-detail-val">{deliveryAddress}</strong>
                    </div>
                    <div className="dest-detail-item">
                      <span className="dest-detail-label">Delivery Fee:</span>
                      <span className="dest-detail-val gold-highlight">$3.50 (Courier Express)</span>
                    </div>
                    <div className="dest-detail-item">
                      <span className="dest-detail-label">Estimated Time:</span>
                      <span className="dest-detail-val">30 - 40 Minutes</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="checkout-payment-section">
              <h4 className="checkout-section-heading">Select Payment Method</h4>

              <div className="payment-options-grid">
                {/* Option 1: Credit / Debit Card */}
                <button
                  type="button"
                  className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="pay-card-radio">
                    <span className="radio-circle" />
                  </div>
                  <div className="pay-card-content">
                    <div className="pay-card-title-row">
                      <CreditCardIcon size={18} />
                      <span className="pay-card-title">Credit / Debit Card</span>
                    </div>
                    <p className="pay-card-desc">Visa, Mastercard, Amex mock transaction</p>
                  </div>
                </button>

                {/* Option 2: Apple Pay / Digital Wallet */}
                <button
                  type="button"
                  className={`payment-method-card ${paymentMethod === 'digital' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('digital')}
                >
                  <div className="pay-card-radio">
                    <span className="radio-circle" />
                  </div>
                  <div className="pay-card-content">
                    <div className="pay-card-title-row">
                      <span className="pay-brand-icon"> / G</span>
                      <span className="pay-card-title">Apple Pay / Google Pay</span>
                    </div>
                    <p className="pay-card-desc">Instant 1-touch biometric checkout</p>
                  </div>
                </button>

                {/* Option 3: Table / Cash */}
                <button
                  type="button"
                  className={`payment-method-card ${paymentMethod === 'table_cash' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('table_cash')}
                >
                  <div className="pay-card-radio">
                    <span className="radio-circle" />
                  </div>
                  <div className="pay-card-content">
                    <div className="pay-card-title-row">
                      <UtensilsIcon size={16} />
                      <span className="pay-card-title">
                        {orderType === 'dine-in' ? 'Pay at Table' : 'Cash on Delivery'}
                      </span>
                    </div>
                    <p className="pay-card-desc">
                      {orderType === 'dine-in'
                        ? 'Settle with server via cash or portable terminal'
                        : 'Pay cash to driver upon food handover'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Mock Credit Card Form Fields (when card is selected) */}
              {paymentMethod === 'card' && (
                <div className="mock-card-form">
                  <div className="form-field-group">
                    <label className="field-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="field-input"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Card Number</label>
                    <div className="field-input-with-icon">
                      <CreditCardIcon size={16} className="card-input-icon" />
                      <input
                        type="text"
                        className="field-input has-icon"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                  </div>

                  <div className="form-two-col">
                    <div className="form-field-group">
                      <label className="field-label">Expiration Date</label>
                      <input
                        type="text"
                        className="field-input"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="field-label">CVV / CVC</label>
                      <input
                        type="text"
                        className="field-input"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Special Instructions Input */}
              <div className="checkout-notes-field">
                <label className="field-label">Order / Dietary Notes</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="E.g., No cilantro, extra napkins, serve dessert later..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="security-guarantee-note">
                <ShieldCheckIcon size={16} />
                <span>256-Bit SSL Encrypted Mock Gateway • No actual card is charged</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="checkout-right-col">
            <div className="checkout-summary-box">
              <h4 className="summary-box-heading">
                Order Summary ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
              </h4>

              {/* Compact Item List */}
              <div className="summary-items-scroll">
                {items.map(({ dish, quantity }) => (
                  <div key={dish.id} className="summary-dish-row">
                    <img src={dish.image} alt={dish.name} className="summary-dish-thumb" />
                    <div className="summary-dish-text">
                      <span className="summary-dish-name">{dish.name}</span>
                      <span className="summary-dish-qty">Qty: {quantity}</span>
                    </div>
                    <span className="summary-dish-price">
                      ${(dish.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="summary-cost-breakdown">
                <div className="cost-row">
                  <span>Food & Beverage Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {orderType === 'dine-in' ? (
                  <div className="cost-row">
                    <span>Dine-In Service Fee (10%)</span>
                    <span>${serviceCharge.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="cost-row">
                    <span>Courier Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="cost-row">
                  <span>State & Hospitality Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="summary-divider-gold" />

                <div className="cost-row total-cost-row">
                  <div>
                    <span className="total-label">Total Amount</span>
                    <span className="total-currency-note">USD • Guaranteed</span>
                  </div>
                  <span className="grand-total-val">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="button"
                className="btn btn-cognac btn-block btn-lg place-order-submit-btn"
                onClick={handlePlaceOrderClick}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="processing-wrap">
                    <span className="spinner" />
                    <span>Processing Payment & Dispatching...</span>
                  </span>
                ) : (
                  <div className="place-order-content">
                    <span className="place-order-text">Place Order</span>
                    <span className="place-order-amount">${grandTotal.toFixed(2)}</span>
                  </div>
                )}
              </button>

              <p className="order-terms-hint">
                By clicking Place Order, your kitchen ticket will be created immediately and you will receive live preparation updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

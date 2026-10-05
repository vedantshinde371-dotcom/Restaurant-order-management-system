import React from 'react';
import type { ActiveOrder } from '../data/mockRestaurantData';
import {
  CloseIcon,
  PrinterIcon,
  CheckCircleIcon,
  ChefHatIcon,
  ArrowRightIcon,
  HomeDeliveryIcon,
  UtensilsIcon,
} from './Icons';

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ActiveOrder | null;
  onTrackOrder?: (orderId: string) => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  onTrackOrder,
}) => {
  if (!isOpen || !order) return null;

  const isDelivery =
    order.orderType === 'delivery' ||
    order.tableNumber.toLowerCase().includes('delivery');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop receipt-modal-backdrop" onClick={onClose}>
      <div
        className="digital-receipt-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Digital Receipt ${order.receiptNumber || order.id}`}
      >
        {/* Receipt Header Actions */}
        <div className="receipt-actions-top no-print">
          <div className="receipt-status-indicator">
            <CheckCircleIcon size={16} />
            <span>Digital Payment Settled</span>
          </div>

          <div className="receipt-top-btns">
            <button
              type="button"
              className="btn btn-secondary btn-sm print-btn"
              onClick={handlePrint}
              title="Print or Save PDF"
            >
              <PrinterIcon size={15} />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              className="receipt-close-btn"
              onClick={onClose}
              aria-label="Close receipt"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {/* Paper Receipt Card */}
        <div className="receipt-paper-card">
          <div className="receipt-paper-header">
            <div className="receipt-brand-mark">
              <ChefHatIcon size={24} />
              <span className="brand-name">SAVORIA</span>
            </div>
            <p className="brand-sub">FINE DINING RESTAURANT & CELLAR</p>
            <p className="brand-address">
              450 Grand Boulevard, Culinary Arts District, New York, NY 10013
            </p>
            <p className="brand-contact">Tel: +1 (555) 839-2041 • Tax ID: NY-8849201-D</p>
          </div>

          <div className="receipt-paper-divider dashed" />

          {/* Ticket Metadata */}
          <div className="receipt-meta-grid">
            <div className="receipt-meta-row">
              <span className="meta-label">Receipt No:</span>
              <strong className="meta-value">{order.receiptNumber || `REC-${order.id.replace('SAV-', '')}`}</strong>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Order Ref:</span>
              <strong className="meta-value">{order.id}</strong>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Date & Time:</span>
              <span className="meta-value">{order.placedTime}</span>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Service Type:</span>
              <span className="meta-value service-badge">
                {isDelivery ? <HomeDeliveryIcon size={13} /> : <UtensilsIcon size={13} />}
                <span>{isDelivery ? 'Home Delivery Dispatch' : `Dine-In • ${order.tableNumber}`}</span>
              </span>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Destination / Table:</span>
              <span className="meta-value">{order.tableNumber}</span>
            </div>
            <div className="receipt-meta-row">
              <span className="meta-label">Transaction ID:</span>
              <span className="meta-value code-font">
                {order.transactionId || 'TXN-74819201'}
              </span>
            </div>
          </div>

          <div className="receipt-paper-divider dashed" />

          {/* Line Items Table */}
          <div className="receipt-items-table">
            <div className="receipt-items-header">
              <span className="col-desc">Item Description</span>
              <span className="col-qty">Qty</span>
              <span className="col-total">Amount</span>
            </div>

            <div className="receipt-items-body">
              {order.items.map((item, idx) => (
                <div key={idx} className="receipt-item-entry">
                  <div className="receipt-item-main">
                    <span className="item-title">{item.name}</span>
                    <span className="item-qty-val">× {item.quantity}</span>
                    <span className="item-total-val">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Portions & Customizations Breakdown */}
                  {(item.portion || (item.customizations && item.customizations.length > 0)) && (
                    <div className="receipt-item-subtext">
                      {item.portion && <span className="portion-note">{item.portion}</span>}
                      {item.customizations && item.customizations.length > 0 && (
                        <span className="custom-note">
                          ({item.customizations.join(', ')})
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
              ))}
            </div>
          </div>

          <div className="receipt-paper-divider dashed" />

          {/* Totals Breakdown */}
          <div className="receipt-totals-section">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>

            {order.serviceFee ? (
              <div className="total-row">
                <span>Dine-In Service Charge (10%)</span>
                <span>${order.serviceFee.toFixed(2)}</span>
              </div>
            ) : null}

            {order.deliveryFee ? (
              <div className="total-row">
                <span>Courier Express Delivery</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
            ) : null}

            {order.packagingFee ? (
              <div className="total-row">
                <span>Eco-Friendly Artisanal Packaging</span>
                <span>${order.packagingFee.toFixed(2)}</span>
              </div>
            ) : null}

            <div className="total-row">
              <span>State & Hospitality Tax (8%)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>

            <div className="receipt-paper-divider solid" />

            <div className="total-row grand-total-row">
              <span>TOTAL PAID</span>
              <span className="grand-total-val">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-paper-divider dashed" />

          {/* Payment Method Verification */}
          <div className="receipt-payment-info">
            <div className="pay-line">
              <span className="label">Payment Method:</span>
              <span className="val">{order.paymentMethod || 'Credit Card (•••• 4242)'}</span>
            </div>
            <div className="pay-line">
              <span className="label">Payment Status:</span>
              <span className="val status-paid">
                ✓ {order.paymentStatus || 'PAID & CONFIRMED'}
              </span>
            </div>
            <div className="pay-line">
              <span className="label">Gateway Auth:</span>
              <span className="val code-font">AUTH# 994821 - 256bit SSL</span>
            </div>
          </div>

          <div className="receipt-paper-footer">
            <p className="thank-you-msg">Thank you for dining with SAVORIA!</p>
            <p className="receipt-qr-text">
              Keep this digital receipt for your culinary records and loyalty point redemption.
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="receipt-footer-actions no-print">
          {onTrackOrder && (
            <button
              type="button"
              className="btn btn-cognac btn-block btn-lg"
              onClick={() => {
                onClose();
                onTrackOrder(order.id);
              }}
            >
              <span>Track Live Delivery & Kitchen Status</span>
              <ArrowRightIcon size={16} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={onClose}
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

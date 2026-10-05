import React from 'react';
import type { ActiveOrder } from '../data/mockRestaurantData';
import {
  CloseIcon,
  RotateCcwIcon,
  ReceiptIcon,
  ArrowRightIcon,
  HomeDeliveryIcon,
  UtensilsIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
} from './Icons';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ActiveOrder | null;
  onReorder: (order: ActiveOrder) => void;
  onTrackOrder?: (orderId: string) => void;
  onOpenReceipt: (order: ActiveOrder) => void;
  onRateOrder?: (order: ActiveOrder) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onReorder,
  onTrackOrder,
  onOpenReceipt,
  onRateOrder,
}) => {
  if (!isOpen || !order) return null;

  const isDelivery =
    order.orderType === 'delivery' ||
    order.tableNumber.toLowerCase().includes('delivery');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="order-details-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Order Details for ${order.id}`}
      >
        {/* Header */}
        <div className="order-modal-header">
          <div className="order-modal-header-left">
            <span className="order-modal-tag">DINING TICKET DETAILS</span>
            <div className="order-modal-id-row">
              <h2 className="order-modal-title">{order.id}</h2>
              <span className={`order-modal-type-badge ${isDelivery ? 'delivery' : 'dine-in'}`}>
                {isDelivery ? <HomeDeliveryIcon size={14} /> : <UtensilsIcon size={14} />}
                <span>{isDelivery ? 'Home Delivery' : `Dine-In • ${order.tableNumber}`}</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="order-modal-close-btn"
            onClick={onClose}
            aria-label="Close order details"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="order-modal-body">
          {/* Status Capsule Card */}
          <div className="order-status-banner">
            <div className="status-banner-left">
              <div className="status-pulse-circle">
                <CheckCircleIcon size={18} />
              </div>
              <div>
                <span className="status-banner-caption">Current State</span>
                <h4 className="status-banner-title">{order.statusText}</h4>
              </div>
            </div>
            <div className="status-banner-time">
              <ClockIcon size={14} />
              <span>{order.placedTime}</span>
            </div>
          </div>

          {/* Delivery or Dining Destination */}
          <div className="order-info-section-box">
            <h4 className="order-section-subtitle">
              {isDelivery ? 'Delivery Destination' : 'Table Reservation'}
            </h4>
            <p className="order-destination-text">{order.tableNumber}</p>
          </div>

          {/* Ordered Dishes List with Customizations */}
          <div className="order-dishes-section">
            <h4 className="order-section-subtitle">
              Ordered Creations ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)
            </h4>

            <div className="order-modal-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-modal-dish-row">
                  <div className="dish-row-left">
                    <span className="dish-row-qty">{item.quantity}×</span>
                    <div>
                      <h5 className="dish-row-name">{item.name}</h5>

                      {/* Portions & Customizations */}
                      {item.portion && (
                        <div className="dish-custom-badge-line">
                          <span className="portion-chip">{item.portion}</span>
                        </div>
                      )}

                      {item.customizations && item.customizations.length > 0 && (
                        <div className="dish-custom-list">
                          {item.customizations.map((custom, cIdx) => (
                            <span key={cIdx} className="custom-detail-chip">
                              • {custom}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.specialInstructions && (
                        <p className="dish-special-instructions">
                          <em>Special Request:</em> "{item.specialInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="dish-row-price">
                    <span className="price-math">
                      ${item.price.toFixed(2)} ea
                    </span>
                    <strong className="price-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="order-modal-financials">
            <h4 className="order-section-subtitle">Payment & Charges Breakdown</h4>
            <div className="financials-rows-list">
              <div className="fin-row">
                <span>Items Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>

              {order.serviceFee ? (
                <div className="fin-row">
                  <span>Dine-In Service Charge (10%)</span>
                  <span>${order.serviceFee.toFixed(2)}</span>
                </div>
              ) : null}

              {order.deliveryFee ? (
                <div className="fin-row">
                  <span>Courier Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
              ) : null}

              {order.packagingFee ? (
                <div className="fin-row">
                  <span>Eco-Packaging Fee</span>
                  <span>${order.packagingFee.toFixed(2)}</span>
                </div>
              ) : null}

              <div className="fin-row">
                <span>Estimated Hospitality Tax (8%)</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>

              <div className="fin-divider" />

              <div className="fin-row grand-total-fin">
                <span className="fin-total-label">Total Amount Paid</span>
                <span className="fin-total-val">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="fin-payment-method-row">
              <span className="pay-method-tag">
                Settled via: <strong>{order.paymentMethod || 'Credit Card (•••• 4242)'}</strong>
              </span>
              <span className="pay-status-pill">
                ✓ {order.paymentStatus || 'Paid & Confirmed'}
              </span>
            </div>
          </div>

          {/* Customer Rating & Feedback Section */}
          {order.rating ? (
            <div className="order-rating-display-card">
              <div className="rating-card-header">
                <span className="rating-card-tag">YOUR DINING REVIEW</span>
                <span className="rating-date">{order.rating.submittedAt}</span>
              </div>
              <div className="rating-scores-grid">
                <div className="score-item">
                  <span className="score-label">Food Quality:</span>
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        size={14}
                        className={s <= order.rating!.food ? 'gold-star' : 'muted-star'}
                      />
                    ))}
                  </div>
                </div>
                <div className="score-item">
                  <span className="score-label">Service & Delivery:</span>
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        size={14}
                        className={s <= order.rating!.service ? 'gold-star' : 'muted-star'}
                      />
                    ))}
                  </div>
                </div>
                <div className="score-item">
                  <span className="score-label">Overall Experience:</span>
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        size={14}
                        className={s <= order.rating!.overall ? 'gold-star' : 'muted-star'}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {order.rating.comment && (
                <p className="rating-comment-text">"{order.rating.comment}"</p>
              )}
            </div>
          ) : (
            onRateOrder && (
              <div className="order-rate-cta-box">
                <div>
                  <h5 className="rate-cta-title">How was this dining experience?</h5>
                  <p className="rate-cta-sub">
                    Rate the food quality, courier service, and share your culinary feedback.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    onClose();
                    onRateOrder(order);
                  }}
                >
                  <StarIcon size={14} />
                  <span>Leave Review</span>
                </button>
              </div>
            )
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="order-modal-footer">
          {/* Reorder Button */}
          <button
            type="button"
            className="btn btn-cognac reorder-modal-btn"
            onClick={() => {
              onClose();
              onReorder(order);
            }}
          >
            <RotateCcwIcon size={16} />
            <span>Reorder These Items</span>
          </button>

          {/* View Digital Receipt */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onOpenReceipt(order);
            }}
          >
            <ReceiptIcon size={16} />
            <span>View Receipt</span>
          </button>

          {/* Track Order (if live) */}
          {onTrackOrder && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onTrackOrder(order.id);
              }}
            >
              <span>Track Live Status</span>
              <ArrowRightIcon size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

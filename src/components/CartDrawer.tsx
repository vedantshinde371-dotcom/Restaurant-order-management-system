import React, { useState } from 'react';
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowRightIcon,
  ChefHatIcon,
  MapPinIcon,
  UtensilsIcon,
  HomeDeliveryIcon,
  EditIcon,
} from './Icons';
import type { CartItem } from '../data/mockRestaurantData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number, itemId?: string) => void;
  onRemoveItem: (dishId: string, itemId?: string) => void;
  onEditCustomization?: (item: CartItem) => void;
  onProceedToPay: (locationTarget: string, kitchenNotes: string) => void;
  currentTable: string;
  orderType: 'dine-in' | 'delivery';
  deliveryAddress: string;
  onSelectTable?: (table: string) => void;
  onSelectAddress?: (address: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onEditCustomization,
  onProceedToPay,
  currentTable,
  orderType,
  deliveryAddress,
  onSelectTable,
  onSelectAddress,
}) => {
  const [kitchenNotes, setKitchenNotes] = useState('');

  if (!isOpen) return null;

  const table = currentTable || 'Table 04';
  const address = deliveryAddress;

  const subtotal = items.reduce((sum, item) => {
    const price = item.unitPrice ?? item.dish.price;
    return sum + price * item.quantity;
  }, 0);

  const serviceCharge = orderType === 'dine-in' ? +(subtotal * 0.1).toFixed(2) : 0;
  const deliveryFee = orderType === 'delivery' ? 3.50 : 0;
  const packagingFee = orderType === 'delivery' ? 1.50 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const grandTotal = +(subtotal + serviceCharge + deliveryFee + packagingFee + tax).toFixed(2);

  const handleProceedToPayClick = () => {
    if (items.length === 0) return;
    const target = orderType === 'dine-in' ? (table || 'Table 04') : address;
    onProceedToPay(target, kitchenNotes);
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <aside
        className="cart-drawer-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Your Dining Order Cart"
      >
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title-row">
            <div className="cart-badge-icon">
              {orderType === 'dine-in' ? <UtensilsIcon size={20} /> : <HomeDeliveryIcon size={20} />}
            </div>
            <div>
              <h3 className="cart-title">
                {orderType === 'dine-in' ? 'Your Table Cart' : 'Home Delivery Cart'}
              </h3>
              <p className="cart-subtitle">Review customized items & required charges before payment</p>
            </div>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Location / Booking Information Bar (Before Payment) */}
        <div className="cart-destination-card-wrap">
          {orderType === 'dine-in' ? (
            <div className="cart-booking-info-box">
              <div className="cart-booking-top">
                <span className="cart-badge-pill">DINE-IN TABLE BOOKING</span>
                <span className="cart-booking-sub">Assigned Server: Marco</span>
              </div>
              <div className="cart-table-select-row">
                <label htmlFor="cart-table-select" className="cart-table-label">
                  Dining Table:
                </label>
                <select
                  id="cart-table-select"
                  className="cart-table-select"
                  value={table}
                  onChange={(e) => {
                    if (onSelectTable) onSelectTable(e.target.value);
                  }}
                >
                  <option value="Table 01">Table 01 (Indoor - 2 Guests)</option>
                  <option value="Table 04">Table 04 (Indoor - 4 Guests)</option>
                  <option value="Table 07">Table 07 (Indoor Terrace - 4 Guests)</option>
                  <option value="Table 12">Table 12 (Garden Patio - 4 Guests)</option>
                  <option value="Table 18">Table 18 (Sommelier Vault - 8 Guests)</option>
                  <option value="Table 21">Table 21 (Royal Oak Salon - 6 Guests)</option>
                </select>
              </div>
              <span className="cart-note-micro">
                ✓ Table service active. Food will be served hot directly to this table.
              </span>
            </div>
          ) : (
            <div className="cart-booking-info-box delivery-box">
              <div className="cart-booking-top">
                <span className="cart-badge-pill delivery-pill">HOME DELIVERY DISPATCH</span>
                <span className="cart-delivery-fee-badge">Delivery Fee: $3.50</span>
              </div>
              <div className="cart-address-input-row">
                <MapPinIcon size={15} className="map-pin-icon" />
                <input
                  type="text"
                  className="cart-address-input"
                  value={address}
                  onChange={(e) => {
                    if (onSelectAddress) onSelectAddress(e.target.value);
                  }}
                  placeholder="Enter street & apartment..."
                />
              </div>
              <span className="cart-note-micro">
                ✓ Courier dispatch assigned • Estimated arrival in 30 - 40 mins
              </span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="cart-items-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon-circle">
                <ChefHatIcon size={32} />
              </div>
              <h4>Your order cart is empty</h4>
              <p>Explore our menu and add artisan dishes or cocktails to your order.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClose}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => {
                const { dish, quantity, selectedPortion, selectedCustomizations, specialInstructions } = item;
                const unitPrice = item.unitPrice ?? dish.price;
                const lineTotal = (unitPrice * quantity).toFixed(2);

                return (
                  <div key={item.id || dish.id} className="cart-item-row">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="cart-item-thumb"
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-top-header">
                        <h5 className="cart-item-name">{dish.name}</h5>
                        {onEditCustomization && (
                          <button
                            type="button"
                            className="cart-edit-custom-btn"
                            onClick={() => onEditCustomization(item)}
                            title="Edit portions & customizations"
                          >
                            <EditIcon size={13} />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>

                      {/* Portions & Customizations display */}
                      {selectedPortion && (
                        <div className="cart-custom-line">
                          <span className="cart-portion-tag">{selectedPortion.name}</span>
                        </div>
                      )}

                      {selectedCustomizations && selectedCustomizations.length > 0 && (
                        <div className="cart-custom-tags-wrap">
                          {selectedCustomizations.map((c, idx) => (
                            <span key={idx} className="cart-custom-pill">
                              {c.optionNames.join(', ')}
                            </span>
                          ))}
                        </div>
                      )}

                      {specialInstructions && (
                        <div className="cart-special-note">
                          Note: "{specialInstructions}"
                        </div>
                      )}

                      <span className="cart-item-price">
                        ${lineTotal}{' '}
                        <small>(${unitPrice.toFixed(2)} ea)</small>
                      </span>

                      {/* Quantity Selector */}
                      <div className="cart-quantity-controls">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(dish.id, -1, item.id)}
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span className="qty-number">{quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(dish.id, 1, item.id)}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => onRemoveItem(dish.id, item.id)}
                      aria-label={`Remove ${dish.name}`}
                      title="Remove item"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                );
              })}

              {/* Kitchen Note Field */}
              <div className="cart-notes-wrapper">
                <label htmlFor="kitchen-notes" className="cart-notes-label">
                  Special Kitchen / Delivery Instructions
                </label>
                <textarea
                  id="kitchen-notes"
                  className="cart-notes-textarea"
                  placeholder={
                    orderType === 'dine-in'
                      ? 'E.g., Steaks medium-rare, dressing on the side, allergies...'
                      : 'E.g., Ring doorbell, leave at front door, extra cutlery...'
                  }
                  rows={2}
                  value={kitchenNotes}
                  onChange={(e) => setKitchenNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-breakdown">
              <div className="summary-line">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {orderType === 'dine-in' ? (
                <div className="summary-line">
                  <span>Dine-In Service Fee (10%)</span>
                  <span>${serviceCharge.toFixed(2)}</span>
                </div>
              ) : (
                <>
                  <div className="summary-line">
                    <span>Home Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Eco-Friendly Packaging Fee</span>
                    <span>${packagingFee.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="summary-line">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-line total-line">
                <span>Total Due</span>
                <span className="total-amount">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Prominent Proceed to Pay Button */}
            <button
              type="button"
              className="btn btn-cognac btn-block btn-lg proceed-to-pay-btn"
              onClick={handleProceedToPayClick}
            >
              <span>Proceed to Pay</span>
              <span className="btn-amount-badge">${grandTotal.toFixed(2)}</span>
              <ArrowRightIcon size={18} />
            </button>
            <p className="cart-footer-note">
              Next: Review order summary & choose payment method
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

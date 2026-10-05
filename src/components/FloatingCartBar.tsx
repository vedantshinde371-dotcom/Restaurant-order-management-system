import React from 'react';
import { ShoppingBagIcon, ArrowRightIcon } from './Icons';

interface FloatingCartBarProps {
  itemCount: number;
  totalAmount: number;
  onOpenCart: () => void;
  onCheckout: () => void;
  isVisible: boolean;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  itemCount,
  totalAmount,
  onOpenCart,
  onCheckout,
  isVisible,
}) => {
  if (!isVisible || itemCount === 0) return null;

  return (
    <div className="floating-cart-bar-anchor" role="region" aria-label="Cart Notification Bar">
      <div className="floating-cart-pill-wrap">
        {/* Left Section: Clicking "View Cart" opens the cart drawer */}
        <button
          type="button"
          className="floating-cart-view-btn"
          onClick={onOpenCart}
          aria-label={`View Cart: ${itemCount} items, total $${totalAmount.toFixed(2)}`}
          title="Open Cart Drawer"
        >
          <div className="floating-cart-icon-wrap">
            <ShoppingBagIcon size={18} />
            <span className="floating-cart-count-badge">{itemCount}</span>
          </div>
          <div className="floating-cart-text-col">
            <span className="floating-cart-title">View Cart</span>
            <span className="floating-cart-subtitle">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} • ${totalAmount.toFixed(2)}
            </span>
          </div>
        </button>

        <div className="floating-cart-pill-divider" aria-hidden="true" />

        {/* Right Section: Clicking the arrow button opens Checkout / Payment page */}
        <button
          type="button"
          className="floating-cart-checkout-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCheckout();
          }}
          aria-label={`Proceed to Checkout - $${totalAmount.toFixed(2)}`}
          title="Proceed to Checkout & Payment"
        >
          <span className="floating-cart-total">${totalAmount.toFixed(2)}</span>
          <span className="floating-cart-checkout-label">Pay</span>
          <div className="floating-cart-arrow-circle" aria-hidden="true">
            <ArrowRightIcon size={16} />
          </div>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import type { ManagerDiscountOffer } from '../../data/mockRestaurantData';
import { TagIcon, PlusIcon, CheckIcon, XIcon } from '../Icons';

interface DiscountsOffersViewProps {
  offers: ManagerDiscountOffer[];
  onUpdateOffers: (updated: ManagerDiscountOffer[]) => void;
  onLogAudit: (action: string, module: 'Discounts', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const DiscountsOffersView: React.FC<DiscountsOffersViewProps> = ({
  offers,
  onUpdateOffers,
  onLogAudit,
}) => {
  const [offerList, setOfferList] = useState<ManagerDiscountOffer[]>(offers);
  const [isAddingOffer, setIsAddingOffer] = useState<boolean>(false);
  const [newOffer, setNewOffer] = useState<Partial<ManagerDiscountOffer>>({
    code: 'ROYAL15',
    title: 'Autumn Epicurean Feast',
    type: 'percentage',
    value: 15,
    minOrderValue: 2500,
    maxDiscountCap: 1500,
    validUntil: '31 Oct 2026',
    applicableOn: 'All Menu',
  });

  const handleToggleStatus = (id: string) => {
    const updated = offerList.map((off) => {
      if (off.id === id) {
        const nextStatus = off.status === 'active' ? 'paused' : 'active';
        onLogAudit(
          'Promotional Offer Status Changed',
          'Discounts',
          `Coupon "${off.code}" (${off.title}) switched to ${nextStatus.toUpperCase()}.`,
          'info'
        );
        return { ...off, status: nextStatus as 'active' | 'paused' };
      }
      return off;
    });
    setOfferList(updated);
    onUpdateOffers(updated);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.code || !newOffer.value) return;

    const created: ManagerDiscountOffer = {
      id: `off-${offerList.length + 1}`,
      code: newOffer.code.toUpperCase().replace(/\s+/g, ''),
      title: newOffer.title || 'Special Promotion',
      type: newOffer.type as 'percentage' | 'flat',
      value: Number(newOffer.value),
      minOrderValue: Number(newOffer.minOrderValue || 0),
      maxDiscountCap: Number(newOffer.maxDiscountCap || 1000),
      validUntil: newOffer.validUntil || '31 Dec 2026',
      usageCount: 0,
      status: 'active',
      applicableOn: newOffer.applicableOn as any,
    };

    const updated = [created, ...offerList];
    setOfferList(updated);
    onUpdateOffers(updated);
    onLogAudit(
      'New Promo Code Created',
      'Discounts',
      `Created coupon "${created.code}" (${created.type === 'percentage' ? `${created.value}%` : `₹${created.value}`} off, min order ₹${created.minOrderValue}).`,
      'info'
    );
    setIsAddingOffer(false);
  };

  return (
    <div className="mgr-discounts-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Discounts, Promotional Codes & Dynamic Pricing</h2>
          <p className="mgr-section-subtitle">
            Configure patron loyalty vouchers, dining privilege rules, minimum spend thresholds, and promotional caps.
          </p>
        </div>
        <button className="mgr-primary-btn" onClick={() => setIsAddingOffer(true)}>
          <PlusIcon /> Create Promo Code
        </button>
      </div>

      {/* Offer Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {offerList.map((offer) => {
          const isActive = offer.status === 'active';
          return (
            <div
              key={offer.id}
              className="mgr-card"
              style={{
                borderTop: `4px solid ${isActive ? '#e5a962' : '#6e6259'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        background: 'rgba(201, 137, 61, 0.15)',
                        border: '1px solid rgba(201, 137, 61, 0.3)',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#f5efe6',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {offer.code}
                    </div>
                  </div>
                  <span
                    className={`mgr-badge ${
                      offer.status === 'active'
                        ? 'mgr-badge-success'
                        : offer.status === 'paused'
                        ? 'mgr-badge-warning'
                        : 'mgr-badge-neutral'
                    }`}
                  >
                    {offer.status.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f5efe6', marginBottom: '0.4rem' }}>
                  {offer.title}
                </h3>

                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e5a962', marginBottom: '0.75rem' }}>
                  {offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} FLAT OFF`}
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#a89c90',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Min Order Spend:</span>
                    <strong style={{ color: '#f5efe6' }}>₹{offer.minOrderValue.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Max Discount Cap:</span>
                    <strong style={{ color: '#f5efe6' }}>₹{offer.maxDiscountCap.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Applicable On:</span>
                    <strong style={{ color: '#c9893d' }}>{offer.applicableOn}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Valid Through:</span>
                    <span style={{ color: '#f5efe6' }}>{offer.validUntil}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Redemptions:</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>{offer.usageCount} guests</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                    color: isActive ? '#f59e0b' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  onClick={() => handleToggleStatus(offer.id)}
                >
                  {isActive ? <XIcon /> : <CheckIcon />}
                  {isActive ? 'Pause Coupon' : 'Activate Coupon'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Offer Modal */}
      {isAddingOffer && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Create Promotional Coupon</h3>
              <button className="mgr-icon-btn" onClick={() => setIsAddingOffer(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleCreateOffer}>
              <div className="mgr-modal-body">
                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Coupon Code (Uppercase)</label>
                    <input
                      type="text"
                      className="mgr-form-input"
                      placeholder="e.g. VIPDINER25"
                      value={newOffer.code}
                      onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Discount Type</label>
                    <select
                      className="mgr-form-select"
                      value={newOffer.type}
                      onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value as any })}
                    >
                      <option value="percentage">Percentage (% Off)</option>
                      <option value="flat">Flat Amount (₹ Off)</option>
                    </select>
                  </div>
                </div>

                <div className="mgr-form-group">
                  <label className="mgr-form-label">Campaign Title / Description</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    placeholder="e.g. Sommelier Weekend Tasting Privilege"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Discount Value ({newOffer.type === 'percentage' ? '%' : '₹'})</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newOffer.value}
                      onChange={(e) => setNewOffer({ ...newOffer, value: Number(e.target.value) })}
                      min={1}
                      required
                    />
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Min Spend (₹)</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newOffer.minOrderValue}
                      onChange={(e) => setNewOffer({ ...newOffer, minOrderValue: Number(e.target.value) })}
                    />
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Max Cap (₹)</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newOffer.maxDiscountCap}
                      onChange={(e) => setNewOffer({ ...newOffer, maxDiscountCap: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Valid Until</label>
                    <input
                      type="text"
                      className="mgr-form-input"
                      value={newOffer.validUntil}
                      onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                      placeholder="e.g. 31 Dec 2026"
                    />
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Applicable Channels</label>
                    <select
                      className="mgr-form-select"
                      value={newOffer.applicableOn}
                      onChange={(e) => setNewOffer({ ...newOffer, applicableOn: e.target.value as any })}
                    >
                      <option value="All Menu">All Menu Items</option>
                      <option value="Dine-In Only">Dine-In Only</option>
                      <option value="Delivery Only">Delivery Only</option>
                      <option value="Chef Specials">Chef Specials</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button type="button" className="mgr-secondary-btn" onClick={() => setIsAddingOffer(false)}>
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  <TagIcon /> Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

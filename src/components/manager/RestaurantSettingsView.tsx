import React, { useState } from 'react';
import { type ManagerSettings, INITIAL_MANAGER_SETTINGS } from '../../data/mockRestaurantData';
import { CheckIcon, SlidersIcon } from '../Icons';

interface RestaurantSettingsViewProps {
  onLogAudit: (action: string, module: 'Security' | 'Billing', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const RestaurantSettingsView: React.FC<RestaurantSettingsViewProps> = ({ onLogAudit }) => {
  const [settings, setSettings] = useState<ManagerSettings>(INITIAL_MANAGER_SETTINGS);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    onLogAudit(
      'Restaurant Master Settings Saved',
      'Security',
      `Updated GST (${settings.defaultGstPercent}%), Service Charge (${settings.serviceChargePercent}%), and restaurant business info.`,
      'info'
    );
    setTimeout(() => {
      setSavedBanner(false);
    }, 3500);
  };

  return (
    <div className="mgr-settings-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Establishment & Regulatory Configuration</h2>
          <p className="mgr-section-subtitle">
            Configure legal entity disclosures, GSTIN/FSSAI compliance records, service charge policies, and operational parameters.
          </p>
        </div>
      </div>

      {savedBanner && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#10b981',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
          }}
        >
          <CheckIcon /> Establishment settings saved and synchronized across POS terminals.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Business Profile */}
        <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f5efe6', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersIcon /> Business Identity & Legal Licenses
          </h3>
          <div className="mgr-form-row">
            <div className="mgr-form-group">
              <label className="mgr-form-label">Restaurant Brand Name</label>
              <input
                type="text"
                className="mgr-form-input"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                required
              />
            </div>
            <div className="mgr-form-group">
              <label className="mgr-form-label">Legal Corporate Entity</label>
              <input
                type="text"
                className="mgr-form-input"
                value={settings.legalEntity}
                onChange={(e) => setSettings({ ...settings, legalEntity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mgr-form-group">
            <label className="mgr-form-label">Luxury Tagline / Subtitle</label>
            <input
              type="text"
              className="mgr-form-input"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
          </div>

          <div className="mgr-form-row">
            <div className="mgr-form-group">
              <label className="mgr-form-label">GSTIN Identification</label>
              <input
                type="text"
                className="mgr-form-input"
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                required
              />
            </div>
            <div className="mgr-form-group">
              <label className="mgr-form-label">FSSAI License Number</label>
              <input
                type="text"
                className="mgr-form-input"
                value={settings.fssaiNumber}
                onChange={(e) => setSettings({ ...settings, fssaiNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mgr-form-row">
            <div className="mgr-form-group">
              <label className="mgr-form-label">Official Phone</label>
              <input
                type="text"
                className="mgr-form-input"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <div className="mgr-form-group">
              <label className="mgr-form-label">Official Email</label>
              <input
                type="email"
                className="mgr-form-input"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mgr-form-group">
            <label className="mgr-form-label">Registered Physical Address</label>
            <input
              type="text"
              className="mgr-form-input"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>
        </div>

        {/* Taxation & Service Charges */}
        <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f5efe6', marginBottom: '1.25rem' }}>
            Taxation, Gratuity & Fiscal Policies
          </h3>
          <div className="mgr-form-row">
            <div className="mgr-form-group">
              <label className="mgr-form-label">Goods & Services Tax (GST %)</label>
              <input
                type="number"
                step="0.1"
                className="mgr-form-input"
                value={settings.defaultGstPercent}
                onChange={(e) => setSettings({ ...settings, defaultGstPercent: Number(e.target.value) })}
                required
              />
              <span style={{ fontSize: '0.72rem', color: '#a89c90' }}>
                Split equally: {settings.defaultGstPercent / 2}% CGST + {settings.defaultGstPercent / 2}% SGST
              </span>
            </div>

            <div className="mgr-form-group">
              <label className="mgr-form-label">Staff Service Charge (%)</label>
              <input
                type="number"
                step="0.5"
                className="mgr-form-input"
                value={settings.serviceChargePercent}
                onChange={(e) => setSettings({ ...settings, serviceChargePercent: Number(e.target.value) })}
                required
              />
              <span style={{ fontSize: '0.72rem', color: '#a89c90' }}>
                Allocated directly to floor & kitchen team gratuity pool
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f5efe6', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.isServiceChargeMandatory}
                onChange={(e) => setSettings({ ...settings, isServiceChargeMandatory: e.target.checked })}
              />
              Mandatory Service Charge (Discretionary by default)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f5efe6', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enableRoundOff}
                onChange={(e) => setSettings({ ...settings, enableRoundOff: e.target.checked })}
              />
              Auto-round bill grand total to nearest integer
            </label>
          </div>
        </div>

        {/* Operational Constraints */}
        <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f5efe6', marginBottom: '1.25rem' }}>
            Table Reservation & Dining Thresholds
          </h3>
          <div className="mgr-form-row">
            <div className="mgr-form-group">
              <label className="mgr-form-label">Reservation Grace Hold (Minutes)</label>
              <input
                type="number"
                className="mgr-form-input"
                value={settings.tableReservationHoldMins}
                onChange={(e) => setSettings({ ...settings, tableReservationHoldMins: Number(e.target.value) })}
                required
              />
            </div>
            <div className="mgr-form-group">
              <label className="mgr-form-label">Max Online Party Size (Guests)</label>
              <input
                type="number"
                className="mgr-form-input"
                value={settings.maxPartySizeOnline}
                onChange={(e) => setSettings({ ...settings, maxPartySizeOnline: Number(e.target.value) })}
                required
              />
            </div>
            <div className="mgr-form-group">
              <label className="mgr-form-label">Kitchen Expedite Alert (Mins)</label>
              <input
                type="number"
                className="mgr-form-input"
                value={settings.autoExpediteThresholdMins}
                onChange={(e) => setSettings({ ...settings, autoExpediteThresholdMins: Number(e.target.value) })}
                required
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="submit" className="mgr-primary-btn" style={{ padding: '0.6rem 1.5rem' }}>
            <CheckIcon /> Save & Synchronize Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import type { UserProfile, SavedAddress } from '../data/mockRestaurantData';
import {
  CloseIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  LogOutIcon,
  SparklesIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
} from './Icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  onSelectActiveDeliveryAddress?: (addr: string) => void;
}

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Conscious',
  'Pescatarian',
  'Nut Allergy Warning',
  'Dairy Sensitive',
  'Halal Certified Prep',
  'Keto Approved',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onLogout,
  onSelectActiveDeliveryAddress,
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'contact' | 'preferences' | 'addresses'>('account');

  // Contact info form state
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  // Preferences state
  const [dietary, setDietary] = useState<string[]>(profile.dietaryPreferences);
  const [spice, setSpice] = useState(profile.spicePreference);
  const [notifySMS, setNotifySMS] = useState(profile.notificationsSMS);
  const [notifyEmail, setNotifyEmail] = useState(profile.notificationsEmail);
  const [notifyPush, setNotifyPush] = useState(profile.notificationsOrderPush);

  // Addresses state
  const [addresses, setAddresses] = useState<SavedAddress[]>(profile.savedAddresses);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');

  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  if (!isOpen) return null;

  const triggerSuccessMsg = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(''), 2500);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name,
      email,
      phone,
    };
    onUpdateProfile(updated);
    triggerSuccessMsg('Contact information updated successfully.');
  };

  const handleSavePreferences = () => {
    const updated: UserProfile = {
      ...profile,
      dietaryPreferences: dietary,
      spicePreference: spice,
      notificationsSMS: notifySMS,
      notificationsEmail: notifyEmail,
      notificationsOrderPush: notifyPush,
    };
    onUpdateProfile(updated);
    triggerSuccessMsg('Culinary preferences and alert channels updated.');
  };

  const handleToggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      address: newStreet.trim(),
      isDefault: addresses.length === 0,
    };

    const updatedList = [...addresses, newAddr];
    setAddresses(updatedList);
    setNewStreet('');
    setShowAddAddressForm(false);

    onUpdateProfile({ ...profile, savedAddresses: updatedList });
    triggerSuccessMsg(`Added new address: ${newLabel}.`);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    onUpdateProfile({ ...profile, savedAddresses: updated });
    triggerSuccessMsg('Saved address removed.');
  };

  const handleSetDefaultAddress = (addr: SavedAddress) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === addr.id,
    }));
    setAddresses(updated);
    onUpdateProfile({ ...profile, savedAddresses: updated });
    if (onSelectActiveDeliveryAddress) {
      onSelectActiveDeliveryAddress(addr.address);
    }
    triggerSuccessMsg(`Default delivery address set to ${addr.label}.`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="profile-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Customer Profile & Preferences"
      >
        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-header-left">
            <div className="profile-avatar-large">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="profile-user-name">{name}</h2>
              <span className="profile-member-badge">
                <SparklesIcon size={13} />
                <span>{profile.memberTier}</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="profile-close-btn"
            onClick={onClose}
            aria-label="Close profile"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Success toast notification */}
        {savedSuccessMsg && (
          <div className="profile-alert-banner">
            <CheckCircleIcon size={16} />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="profile-tabs-nav" role="tablist">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account & Loyalty
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Details
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            Addresses ({addresses.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="profile-modal-body">
          {/* TAB 1: Account & Loyalty */}
          {activeTab === 'account' && (
            <div className="profile-tab-content">
              <div className="loyalty-card-vip">
                <div className="loyalty-card-top">
                  <div>
                    <span className="loyalty-label">VIP REWARDS BALANCE</span>
                    <h3 className="loyalty-points-val">
                      {profile.loyaltyPoints} <small>PTS</small>
                    </h3>
                  </div>
                  <div className="loyalty-tier-badge">{profile.memberTier}</div>
                </div>

                <div className="loyalty-card-bottom">
                  <div className="loyalty-metric">
                    <span className="metric-label">Credit Value:</span>
                    <span className="metric-val">
                      ${(profile.loyaltyPoints * 0.05).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="loyalty-metric">
                    <span className="metric-label">Member Since:</span>
                    <span className="metric-val">{profile.memberSince}</span>
                  </div>
                  <div className="loyalty-metric">
                    <span className="metric-label">Total Orders Placed:</span>
                    <span className="metric-val">{profile.ordersPlacedCount} tickets</span>
                  </div>
                </div>
              </div>

              <div className="account-privileges-box">
                <h4 className="privileges-title">Epicurean Club Privileges</h4>
                <ul className="privileges-list">
                  <li>✓ Priority tableside seating and Sommelier cellar reservations.</li>
                  <li>✓ Complimentary tableside artisan bread cloche on all orders.</li>
                  <li>✓ Express home delivery courier dispatch with zero packaging fees.</li>
                  <li>✓ Dedicated culinary concierge hotline & WhatsApp channel.</li>
                </ul>
              </div>

              {/* Logout Button */}
              <div className="profile-logout-wrap">
                <button
                  type="button"
                  className="btn btn-secondary text-cognac btn-block profile-logout-btn"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                >
                  <LogOutIcon size={16} />
                  <span>Sign Out / Switch to Staff Portal</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Contact Details */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSaveContact} className="profile-tab-content">
              <div className="form-group">
                <label htmlFor="user-name" className="field-label">
                  <UserIcon size={15} />
                  <span>Full Legal Name</span>
                </label>
                <input
                  id="user-name"
                  type="text"
                  className="profile-field-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-email" className="field-label">
                  <MailIcon size={15} />
                  <span>Email Address</span>
                </label>
                <input
                  id="user-email"
                  type="email"
                  className="profile-field-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-phone" className="field-label">
                  <PhoneIcon size={15} />
                  <span>Mobile Phone (for delivery alerts)</span>
                </label>
                <input
                  id="user-phone"
                  type="tel"
                  className="profile-field-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-cognac btn-block save-tab-btn">
                <span>Save Contact Information</span>
              </button>
            </form>
          )}

          {/* TAB 3: Dining Preferences */}
          {activeTab === 'preferences' && (
            <div className="profile-tab-content">
              <div className="preference-group-box">
                <h4 className="pref-group-title">Dietary Guidelines & Allergens</h4>
                <p className="pref-group-sub">
                  Select your dietary rules. Dishes matching these restrictions will be highlighted automatically.
                </p>

                <div className="dietary-checklist-grid">
                  {DIETARY_OPTIONS.map((item) => {
                    const checked = dietary.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`dietary-check-chip ${checked ? 'checked' : ''}`}
                        onClick={() => handleToggleDietary(item)}
                      >
                        <span className="check-indicator">{checked ? '✓' : '+'}</span>
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="preference-group-box">
                <h4 className="pref-group-title">Default Spice Level Preference</h4>
                <div className="spice-radio-row">
                  {(['Mild', 'Medium', 'Chef Choice', 'High Spice'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`spice-pill ${spice === lvl ? 'active' : ''}`}
                      onClick={() => setSpice(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="preference-group-box">
                <h4 className="pref-group-title">Notification & Dispatch Alerts</h4>
                <div className="toggle-list">
                  <label className="toggle-row">
                    <input
                      type="checkbox"
                      checked={notifySMS}
                      onChange={(e) => setNotifySMS(e.target.checked)}
                    />
                    <span>SMS updates when courier departs or table is ready</span>
                  </label>
                  <label className="toggle-row">
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                    />
                    <span>Email digital receipts and itemized invoices</span>
                  </label>
                  <label className="toggle-row">
                    <input
                      type="checkbox"
                      checked={notifyPush}
                      onChange={(e) => setNotifyPush(e.target.checked)}
                    />
                    <span>Live kitchen & preparation push notifications</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-cognac btn-block save-tab-btn"
                onClick={handleSavePreferences}
              >
                <span>Save Dining Preferences</span>
              </button>
            </div>
          )}

          {/* TAB 4: Saved Delivery Addresses */}
          {activeTab === 'addresses' && (
            <div className="profile-tab-content">
              <div className="addresses-header-row">
                <span className="addresses-subtitle">Saved delivery destinations</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm add-address-btn"
                  onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                >
                  <PlusIcon size={14} />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form Drawer/Block */}
              {showAddAddressForm && (
                <form onSubmit={handleAddAddress} className="add-address-form-box">
                  <h5 className="form-box-title">New Delivery Address</h5>
                  <div className="form-row-split">
                    <div className="form-group">
                      <label htmlFor="address-label" className="field-label">Label</label>
                      <select
                        id="address-label"
                        className="profile-field-input"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Weekend Villa">Weekend Villa</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="street-address" className="field-label">Street Address & Apartment</label>
                    <input
                      id="street-address"
                      type="text"
                      className="profile-field-input"
                      placeholder="E.g., 200 Central Park West, Penthouse A..."
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-actions-row">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddAddressForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-cognac btn-sm">
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses List */}
              <div className="saved-addresses-list">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`saved-address-card ${addr.isDefault ? 'default-card' : ''}`}
                  >
                    <div className="address-card-top">
                      <div className="address-label-badge">
                        <MapPinIcon size={14} />
                        <strong>{addr.label}</strong>
                      </div>
                      {addr.isDefault && (
                        <span className="default-pill">✓ Primary Address</span>
                      )}
                    </div>

                    <p className="address-full-text">{addr.address}</p>

                    <div className="address-card-actions">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm set-default-btn"
                          onClick={() => handleSetDefaultAddress(addr)}
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        type="button"
                        className="address-delete-btn"
                        onClick={() => handleDeleteAddress(addr.id)}
                        aria-label={`Delete ${addr.label}`}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

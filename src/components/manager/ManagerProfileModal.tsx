import React, { useState } from 'react';
import type { ManagerProfile } from '../../data/mockRestaurantData';
import { XIcon, CheckIcon, ShieldCheckIcon } from '../Icons';

interface ManagerProfileModalProps {
  profile: ManagerProfile;
  onClose: () => void;
  onUpdatePin: (newPin: string) => void;
  onNavigateToView?: (view: 'customer' | 'waiter-dashboard' | 'kitchen-dashboard' | 'cashier-dashboard') => void;
}

export const ManagerProfileModal: React.FC<ManagerProfileModalProps> = ({
  profile,
  onClose,
  onUpdatePin,
  onNavigateToView: _onNavigateToView,
}) => {
  const [testPin, setTestPin] = useState<string>('');
  const [pinVerificationResult, setPinVerificationResult] = useState<string | null>(null);
  const [newPin, setNewPin] = useState<string>('');
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [changePinSuccess, setChangePinSuccess] = useState<boolean>(false);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (testPin === profile.securityPin) {
      setPinVerificationResult('valid');
    } else {
      setPinVerificationResult('invalid');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) return;
    onUpdatePin(newPin);
    setChangePinSuccess(true);
    setIsChangingPin(false);
    setNewPin('');
    setTimeout(() => {
      setChangePinSuccess(false);
    }, 3000);
  };

  return (
    <div className="mgr-modal-backdrop">
      <div className="mgr-modal" style={{ maxWidth: '600px' }}>
        <div className="mgr-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheckIcon />
            <h3 className="mgr-modal-title">Executive Identity & Security Clearance</h3>
          </div>
          <button className="mgr-icon-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="mgr-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
          {/* Identity Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(201, 137, 61, 0.15) 0%, rgba(20, 15, 12, 0.9) 100%)',
              border: '1px solid rgba(201, 137, 61, 0.3)',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f5efe6', marginBottom: '0.2rem' }}>
                  {profile.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#e5a962', fontWeight: 600 }}>
                  {profile.role}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a89c90', marginTop: '0.25rem' }}>
                  Employee ID: <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{profile.employeeCode}</strong>
                </div>
              </div>
              <span className="mgr-badge mgr-badge-success">HIGH CLEARANCE</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', fontSize: '0.8rem', color: '#a89c90' }}>
              <div>Email: <span style={{ color: '#f5efe6' }}>{profile.email}</span></div>
              <div>Phone: <span style={{ color: '#f5efe6' }}>{profile.phone}</span></div>
              <div style={{ gridColumn: 'span 2' }}>
                Active Session: <span style={{ color: '#e5a962' }}>{profile.lastLogin}</span>
              </div>
            </div>
          </div>

          {/* Master PIN Override Box */}
          <div className="mgr-card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f5efe6', marginBottom: '0.5rem' }}>
              Master Manager Override PIN (Default: 1234)
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#a89c90', marginBottom: '0.75rem' }}>
              This 4-digit numeric code validates table voids, cashier refund authorization, and manual discount waivers.
            </p>

            {changePinSuccess && (
              <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                ✓ Override PIN successfully updated in encrypted memory.
              </div>
            )}

            {!isChangingPin ? (
              <div>
                <form onSubmit={handleVerifyPin} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="Enter PIN to test"
                    className="mgr-form-input"
                    style={{ width: '150px', letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'monospace' }}
                    value={testPin}
                    onChange={(e) => {
                      setTestPin(e.target.value);
                      setPinVerificationResult(null);
                    }}
                  />
                  <button type="submit" className="mgr-secondary-btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    Verify PIN
                  </button>
                  <button
                    type="button"
                    className="mgr-secondary-btn"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    onClick={() => setIsChangingPin(true)}
                  >
                    Change PIN
                  </button>
                </form>

                {pinVerificationResult === 'valid' && (
                  <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>
                    ✓ Security PIN Verified: ACCESS AUTHORIZED.
                  </div>
                )}
                {pinVerificationResult === 'invalid' && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>
                    ✕ Verification Failed: Invalid PIN code.
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleChangePin} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="New 4-digit PIN"
                  className="mgr-form-input"
                  style={{ width: '150px', letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'monospace' }}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  required
                />
                <button type="submit" className="mgr-primary-btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                  Save New PIN
                </button>
                <button
                  type="button"
                  className="mgr-secondary-btn"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  onClick={() => setIsChangingPin(false)}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Permissions Matrix */}
          <div className="mgr-card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f5efe6', marginBottom: '0.5rem' }}>
              Executive Access & Permissions Matrix
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {profile.permissions.map((perm) => (
                <div key={perm} style={{ fontSize: '0.78rem', color: '#f5efe6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#10b981' }}>✓</span> {perm}
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mgr-modal-footer">
          <button type="button" className="mgr-primary-btn" onClick={onClose}>
            <CheckIcon /> Done
          </button>
        </div>
      </div>
    </div>
  );
};

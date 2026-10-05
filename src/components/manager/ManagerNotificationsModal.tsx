import React, { useState } from 'react';
import type { ManagerNotification } from '../../data/mockRestaurantData';
import { XIcon, CheckIcon, BellIcon, AlertTriangleIcon } from '../Icons';

interface ManagerNotificationsModalProps {
  notifications: ManagerNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSendBroadcast: (channel: 'all' | 'kitchen' | 'waiters', message: string) => void;
}

export const ManagerNotificationsModal: React.FC<ManagerNotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onSendBroadcast,
}) => {
  const [broadcastChannel, setBroadcastChannel] = useState<'all' | 'kitchen' | 'waiters'>('all');
  const [broadcastText, setBroadcastText] = useState<string>('');
  const [broadcastSentNotice, setBroadcastSentNotice] = useState<boolean>(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    onSendBroadcast(broadcastChannel, broadcastText);
    setBroadcastSentNotice(true);
    setBroadcastText('');
    setTimeout(() => {
      setBroadcastSentNotice(false);
    }, 3000);
  };

  return (
    <div className="mgr-modal-backdrop">
      <div className="mgr-modal" style={{ maxWidth: '640px' }}>
        <div className="mgr-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BellIcon />
            <h3 className="mgr-modal-title">Manager Dispatch & System Alerts</h3>
          </div>
          <button className="mgr-icon-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="mgr-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Intercom Broadcast Box */}
          <div
            style={{
              background: 'rgba(201, 137, 61, 0.08)',
              border: '1px solid rgba(201, 137, 61, 0.25)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5a962' }}>
                📢 Priority Staff Intercom Broadcast
              </span>
              <span style={{ fontSize: '0.72rem', color: '#a89c90' }}>
                Pushes alert banner to Waiter POS & Kitchen KDS
              </span>
            </div>

            {broadcastSentNotice && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <CheckIcon /> Broadcast transmitted to active terminals!
              </div>
            )}

            <form onSubmit={handleBroadcast}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <select
                  className="mgr-form-select"
                  style={{ width: '160px', padding: '0.4rem', fontSize: '0.8rem' }}
                  value={broadcastChannel}
                  onChange={(e) => setBroadcastChannel(e.target.value as any)}
                >
                  <option value="all">All Terminals</option>
                  <option value="kitchen">Kitchen KDS Only</option>
                  <option value="waiters">Waiters POS Only</option>
                </select>
                <input
                  type="text"
                  className="mgr-form-input"
                  style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.825rem' }}
                  placeholder="e.g. VIP Party of 10 seated Table 06, expedite entrees"
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="mgr-primary-btn"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  Transmit Intercom
                </button>
              </div>
            </form>
          </div>

          {/* Notifications List Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c9893d' }}>
              ACTIVE SYSTEM ALERTS ({notifications.filter((n) => !n.read).length} UNREAD)
            </span>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#e5a962',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(201, 137, 61, 0.08)',
                  border: notif.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(201, 137, 61, 0.3)',
                  borderLeft:
                    notif.severity === 'urgent'
                      ? '4px solid #ef4444'
                      : notif.severity === 'warning'
                      ? '4px solid #f59e0b'
                      : '4px solid #10b981',
                  borderRadius: '6px',
                  padding: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {notif.severity === 'urgent' ? (
                      <AlertTriangleIcon />
                    ) : (
                      <BellIcon />
                    )}
                    <strong style={{ fontSize: '0.875rem', color: '#f5efe6' }}>{notif.title}</strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#a89c90' }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#a89c90', lineHeight: 1.4, margin: 0 }}>
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mgr-modal-footer">
          <button type="button" className="mgr-secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

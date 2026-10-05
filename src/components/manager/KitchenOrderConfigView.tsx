import React, { useState } from 'react';
import type { ManagerStationConfig } from '../../data/mockRestaurantData';
import { CheckIcon, XIcon, SlidersIcon, AlertTriangleIcon } from '../Icons';

interface KitchenOrderConfigViewProps {
  stations: ManagerStationConfig[];
  onUpdateStations: (updated: ManagerStationConfig[]) => void;
  onLogAudit: (action: string, module: 'Menu' | 'Staff', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const KitchenOrderConfigView: React.FC<KitchenOrderConfigViewProps> = ({
  stations,
  onUpdateStations,
  onLogAudit,
}) => {
  const [stationList, setStationList] = useState<ManagerStationConfig[]>(stations);
  const [editingStation, setEditingStation] = useState<ManagerStationConfig | null>(null);
  const [expediteMinutes, setExpediteMinutes] = useState<number>(20);
  const [autoRebalance, setAutoRebalance] = useState<boolean>(true);

  const handleStatusChange = (id: string, newStatus: 'active' | 'busy' | 'offline') => {
    const updated = stationList.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
    setStationList(updated);
    onUpdateStations(updated);
    const target = stationList.find((s) => s.id === id);
    if (target) {
      onLogAudit(
        'Kitchen Station Status Changed',
        'Staff',
        `Station "${target.name}" switched to ${newStatus.toUpperCase()}.`,
        newStatus === 'offline' ? 'warning' : 'info'
      );
    }
  };

  const handleSaveStationEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation) return;
    const updated = stationList.map((s) => (s.id === editingStation.id ? editingStation : s));
    setStationList(updated);
    onUpdateStations(updated);
    onLogAudit(
      'Kitchen Station Target Reconfigured',
      'Staff',
      `Station "${editingStation.name}" capacity set to ${editingStation.capacityTickets} tickets, target prep: ${editingStation.targetMinutes}m.`,
      'info'
    );
    setEditingStation(null);
  };

  return (
    <div className="mgr-kitchen-config-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Kitchen Routing & Station Capacity Configuration</h2>
          <p className="mgr-section-subtitle">
            Configure line station throughput, target cook times, expedite thresholds, and workload balancing.
          </p>
        </div>
      </div>

      {/* Global Kitchen Policy Card */}
      <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f5efe6', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersIcon /> Automated Kitchen Dispatch Rules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#a89c90', display: 'block', marginBottom: '0.4rem' }}>
              Auto-Expedite Rush Threshold:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                className="mgr-form-input"
                style={{ width: '90px' }}
                value={expediteMinutes}
                onChange={(e) => setExpediteMinutes(Number(e.target.value))}
                min={10}
                max={45}
              />
              <span style={{ fontSize: '0.85rem', color: '#e5a962' }}>Minutes from ticket punch</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#a89c90', display: 'block', marginBottom: '0.4rem' }}>
              Load-Balancing Algorithm:
            </label>
            <button
              type="button"
              className={autoRebalance ? 'mgr-primary-btn' : 'mgr-secondary-btn'}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setAutoRebalance(!autoRebalance)}
            >
              {autoRebalance ? <CheckIcon /> : <XIcon />}
              {autoRebalance ? 'Smart Re-routing Active' : 'Manual Station Dispatch'}
            </button>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#a89c90', display: 'block', marginBottom: '0.4rem' }}>
              KDS Color Status Scheme:
            </label>
            <div style={{ fontSize: '0.8rem', color: '#a89c90' }}>
              🟢 &lt; 10m normal • 🟡 10-20m priority • 🔴 &gt; 20m expedite alert
            </div>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {stationList.map((station) => {
          const loadPercent = Math.round((station.activeTickets / station.capacityTickets) * 100);
          const isOverloaded = loadPercent >= 85;

          return (
            <div
              key={station.id}
              className="mgr-card"
              style={{
                borderTop: `4px solid ${
                  station.status === 'offline'
                    ? '#6e6259'
                    : isOverloaded
                    ? '#ef4444'
                    : station.status === 'busy'
                    ? '#f59e0b'
                    : '#10b981'
                }`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f5efe6' }}>
                      {station.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#c9893d' }}>
                      Lead: {station.leadChef}
                    </div>
                  </div>
                  <span
                    className={`mgr-badge ${
                      station.status === 'offline'
                        ? 'mgr-badge-neutral'
                        : isOverloaded
                        ? 'mgr-badge-critical'
                        : station.status === 'busy'
                        ? 'mgr-badge-warning'
                        : 'mgr-badge-success'
                    }`}
                  >
                    {isOverloaded ? 'CAPACITY PEAK' : station.status.toUpperCase()}
                  </span>
                </div>

                {station.temperature && (
                  <div style={{ fontSize: '0.75rem', color: '#a89c90', marginBottom: '0.75rem' }}>
                    Sensor Temp: <strong style={{ color: '#e5a962' }}>{station.temperature}</strong>
                  </div>
                )}

                {/* Capacity Bar */}
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#f5efe6', marginBottom: '0.35rem' }}>
                    <span>Active Queued Tickets:</span>
                    <strong>
                      {station.activeTickets} / {station.capacityTickets} ({loadPercent}%)
                    </strong>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, loadPercent)}%`,
                        background:
                          loadPercent >= 85 ? '#ef4444' : loadPercent >= 60 ? '#f59e0b' : '#10b981',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a89c90', marginTop: '0.5rem' }}>
                    <span>Target Prep: <strong>{station.targetMinutes}m</strong></span>
                    <span>Actual Avg: <strong style={{ color: station.avgPrepMinutes > station.targetMinutes ? '#ef4444' : '#10b981' }}>{station.avgPrepMinutes}m</strong></span>
                  </div>
                </div>

                {isOverloaded && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.75rem',
                      color: '#ef4444',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <AlertTriangleIcon /> Station nearing peak threshold. Divert secondary orders.
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      fontSize: '0.72rem',
                      padding: '0.3rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: station.status === 'active' ? '#10b981' : 'rgba(255,255,255,0.05)',
                      color: station.status === 'active' ? '#fff' : '#a89c90',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onClick={() => handleStatusChange(station.id, 'active')}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      fontSize: '0.72rem',
                      padding: '0.3rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: station.status === 'busy' ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                      color: station.status === 'busy' ? '#000' : '#a89c90',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onClick={() => handleStatusChange(station.id, 'busy')}
                  >
                    Busy
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      fontSize: '0.72rem',
                      padding: '0.3rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: station.status === 'offline' ? '#6e6259' : 'rgba(255,255,255,0.05)',
                      color: station.status === 'offline' ? '#fff' : '#a89c90',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onClick={() => handleStatusChange(station.id, 'offline')}
                  >
                    Offline
                  </button>
                </div>

                <button
                  type="button"
                  className="mgr-secondary-btn"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
                  onClick={() => setEditingStation(station)}
                >
                  Adjust Capacity & Target Times
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Station Modal */}
      {editingStation && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Configure Station: {editingStation.name}</h3>
              <button className="mgr-icon-btn" onClick={() => setEditingStation(null)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleSaveStationEdit}>
              <div className="mgr-modal-body">
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Lead Chef</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    value={editingStation.leadChef}
                    onChange={(e) => setEditingStation({ ...editingStation, leadChef: e.target.value })}
                    required
                  />
                </div>
                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Max Ticket Capacity</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={editingStation.capacityTickets}
                      onChange={(e) => setEditingStation({ ...editingStation, capacityTickets: Number(e.target.value) })}
                      min={1}
                      max={25}
                      required
                    />
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Target Cook Time (Mins)</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={editingStation.targetMinutes}
                      onChange={(e) => setEditingStation({ ...editingStation, targetMinutes: Number(e.target.value) })}
                      min={3}
                      max={60}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button type="button" className="mgr-secondary-btn" onClick={() => setEditingStation(null)}>
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  Update Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import type { ManagerFloorTable } from '../../data/mockRestaurantData';
import { CheckIcon, PlusIcon, XIcon } from '../Icons';

interface TableLayoutManagementViewProps {
  tables: ManagerFloorTable[];
  onUpdateTables: (updated: ManagerFloorTable[]) => void;
  onLogAudit: (action: string, module: 'Staff' | 'Billing', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const TableLayoutManagementView: React.FC<TableLayoutManagementViewProps> = ({
  tables,
  onUpdateTables,
  onLogAudit,
}) => {
  const [tableList, setTableList] = useState<ManagerFloorTable[]>(tables);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [editingTable, setEditingTable] = useState<ManagerFloorTable | null>(null);
  const [isAddingTable, setIsAddingTable] = useState<boolean>(false);
  const [newTable, setNewTable] = useState<Partial<ManagerFloorTable>>({
    tableNumber: 'Table 15',
    capacity: 4,
    zone: 'Main Dining Hall',
    status: 'available',
  });

  const zones = ['All', 'Main Dining Hall', 'Private Dining Lounge', 'Terrace Garden', 'Bar Lounge'];
  const statuses = ['All', 'available', 'occupied', 'reserved', 'cleaning'];

  const filteredTables = tableList.filter((tbl) => {
    const matchesZone = selectedZone === 'All' || tbl.zone === selectedZone;
    const matchesStatus = selectedStatus === 'All' || tbl.status === selectedStatus;
    return matchesZone && matchesStatus;
  });

  const handleStatusChange = (tableId: string, newStatus: ManagerFloorTable['status']) => {
    const updated = tableList.map((t) => {
      if (t.id === tableId) {
        return {
          ...t,
          status: newStatus,
          currentGuests: newStatus === 'available' ? undefined : t.currentGuests,
          currentBill: newStatus === 'available' ? undefined : t.currentBill,
          seatedMinutes: newStatus === 'available' ? undefined : t.seatedMinutes,
        };
      }
      return t;
    });

    const target = tableList.find((t) => t.id === tableId);
    setTableList(updated);
    onUpdateTables(updated);
    if (target) {
      onLogAudit(
        'Table Status Overridden',
        'Staff',
        `Manager changed ${target.tableNumber} status to "${newStatus.toUpperCase()}".`,
        'info'
      );
    }
  };

  const handleSaveEditTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;
    const updated = tableList.map((t) => (t.id === editingTable.id ? editingTable : t));
    setTableList(updated);
    onUpdateTables(updated);
    onLogAudit(
      'Table Configuration Saved',
      'Staff',
      `Updated ${editingTable.tableNumber} (Capacity: ${editingTable.capacity} guests, Zone: ${editingTable.zone}).`,
      'info'
    );
    setEditingTable(null);
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTable.tableNumber) return;
    const created: ManagerFloorTable = {
      id: `mt-${tableList.length + 1}`,
      tableNumber: newTable.tableNumber,
      capacity: Number(newTable.capacity || 4),
      zone: newTable.zone as any,
      status: 'available',
    };
    const updated = [...tableList, created];
    setTableList(updated);
    onUpdateTables(updated);
    onLogAudit(
      'New Dining Table Added',
      'Staff',
      `Added ${created.tableNumber} in ${created.zone} with capacity ${created.capacity}.`,
      'info'
    );
    setIsAddingTable(false);
  };

  const totalSeats = tableList.reduce((sum, t) => sum + t.capacity, 0);
  const occupiedCount = tableList.filter((t) => t.status === 'occupied').length;
  const availableCount = tableList.filter((t) => t.status === 'available').length;
  const reservedCount = tableList.filter((t) => t.status === 'reserved').length;

  return (
    <div className="mgr-tables-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Table & Floor Architecture Management</h2>
          <p className="mgr-section-subtitle">
            Configure floor zoning, guest capacity allocations, active table turns, and live seating states.
          </p>
        </div>
        <button className="mgr-primary-btn" onClick={() => setIsAddingTable(true)}>
          <PlusIcon /> Add Floor Table
        </button>
      </div>

      {/* KPI stats */}
      <div className="mgr-kpi-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Active Occupancy</div>
          <div className="mgr-kpi-value" style={{ color: '#ef4444' }}>
            {occupiedCount} / {tableList.length}
          </div>
          <div className="mgr-kpi-subtext">
            {Math.round((occupiedCount / tableList.length) * 100)}% active tables
          </div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Vacant & Ready</div>
          <div className="mgr-kpi-value" style={{ color: '#10b981' }}>
            {availableCount} Tables
          </div>
          <div className="mgr-kpi-subtext">Immediate seating available</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Reserved Holds</div>
          <div className="mgr-kpi-value" style={{ color: '#f59e0b' }}>
            {reservedCount} Tables
          </div>
          <div className="mgr-kpi-subtext">VIP & Evening bookings</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Total Floor Capacity</div>
          <div className="mgr-kpi-value" style={{ color: '#e5a962' }}>
            {totalSeats} Covers
          </div>
          <div className="mgr-kpi-subtext">Across 4 curated dining zones</div>
        </div>
      </div>

      {/* Zone & Status Filters */}
      <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#c9893d', fontWeight: 600 }}>ZONE:</span>
            {zones.map((zone) => (
              <button
                key={zone}
                className={`mgr-pill-filter ${selectedZone === zone ? 'active' : ''}`}
                onClick={() => setSelectedZone(zone)}
              >
                {zone}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#a89c90', fontWeight: 600 }}>STATUS:</span>
            {statuses.map((st) => (
              <button
                key={st}
                className={`mgr-pill-filter ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st)}
              >
                {st.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredTables.map((tbl) => {
          const borderColor =
            tbl.status === 'occupied'
              ? '#ef4444'
              : tbl.status === 'reserved'
              ? '#f59e0b'
              : tbl.status === 'cleaning'
              ? '#3b82f6'
              : '#10b981';

          return (
            <div
              key={tbl.id}
              className="mgr-card"
              style={{
                borderTop: `4px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f5efe6' }}>
                    {tbl.tableNumber}
                  </h3>
                  <span
                    className={`mgr-badge ${
                      tbl.status === 'occupied'
                        ? 'mgr-badge-critical'
                        : tbl.status === 'reserved'
                        ? 'mgr-badge-warning'
                        : tbl.status === 'cleaning'
                        ? 'mgr-badge-info'
                        : 'mgr-badge-success'
                    }`}
                  >
                    {tbl.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#c9893d', marginBottom: '0.75rem' }}>
                  {tbl.zone} • {tbl.capacity} Covers
                </div>

                {tbl.status === 'occupied' && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '6px',
                      padding: '0.6rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.8rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f5efe6', marginBottom: '0.2rem' }}>
                      <span>Guests Seated:</span>
                      <strong>{tbl.currentGuests || 2} Pax</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f5efe6', marginBottom: '0.2rem' }}>
                      <span>Seated Time:</span>
                      <strong style={{ color: '#e5a962' }}>{tbl.seatedMinutes || 40} mins</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f5efe6', marginBottom: '0.2rem' }}>
                      <span>Server:</span>
                      <span>{tbl.serverName || 'Service Team'}</span>
                    </div>
                    {tbl.currentBill && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.3rem', marginTop: '0.3rem' }}>
                        <span>Current Bill:</span>
                        <span>₹{tbl.currentBill.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                )}

                {tbl.status === 'reserved' && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '6px',
                      padding: '0.6rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.8rem',
                      color: '#f59e0b',
                    }}
                  >
                    Reserved for Evening Guest • Assigned Server: {tbl.serverName || 'Devan Nair'}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#a89c90', display: 'block', marginBottom: '0.25rem' }}>
                  OVERRIDE STATE:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.3rem',
                      background: tbl.status === 'available' ? '#10b981' : 'rgba(255,255,255,0.05)',
                      color: tbl.status === 'available' ? '#fff' : '#a89c90',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleStatusChange(tbl.id, 'available')}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.3rem',
                      background: tbl.status === 'occupied' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                      color: tbl.status === 'occupied' ? '#fff' : '#a89c90',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleStatusChange(tbl.id, 'occupied')}
                  >
                    Occupied
                  </button>
                  <button
                    type="button"
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.3rem',
                      background: tbl.status === 'reserved' ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                      color: tbl.status === 'reserved' ? '#000' : '#a89c90',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleStatusChange(tbl.id, 'reserved')}
                  >
                    Reserved
                  </button>
                  <button
                    type="button"
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.3rem',
                      background: tbl.status === 'cleaning' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                      color: tbl.status === 'cleaning' ? '#fff' : '#a89c90',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleStatusChange(tbl.id, 'cleaning')}
                  >
                    Cleaning
                  </button>
                </div>

                <button
                  type="button"
                  className="mgr-secondary-btn"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
                  onClick={() => setEditingTable(tbl)}
                >
                  Configure Capacity / Zone
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Table Modal */}
      {editingTable && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Edit {editingTable.tableNumber}</h3>
              <button className="mgr-icon-btn" onClick={() => setEditingTable(null)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleSaveEditTable}>
              <div className="mgr-modal-body">
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Table Number / Identifier</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    value={editingTable.tableNumber}
                    onChange={(e) => setEditingTable({ ...editingTable, tableNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Seating Capacity (Covers)</label>
                  <input
                    type="number"
                    className="mgr-form-input"
                    value={editingTable.capacity}
                    onChange={(e) => setEditingTable({ ...editingTable, capacity: Number(e.target.value) })}
                    min={1}
                    max={20}
                    required
                  />
                </div>
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Dining Zone</label>
                  <select
                    className="mgr-form-select"
                    value={editingTable.zone}
                    onChange={(e) => setEditingTable({ ...editingTable, zone: e.target.value as any })}
                  >
                    <option value="Main Dining Hall">Main Dining Hall</option>
                    <option value="Private Dining Lounge">Private Dining Lounge</option>
                    <option value="Terrace Garden">Terrace Garden</option>
                    <option value="Bar Lounge">Bar Lounge</option>
                  </select>
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button type="button" className="mgr-secondary-btn" onClick={() => setEditingTable(null)}>
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  <CheckIcon /> Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {isAddingTable && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Add New Dining Table</h3>
              <button className="mgr-icon-btn" onClick={() => setIsAddingTable(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleAddTable}>
              <div className="mgr-modal-body">
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Table Label</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    value={newTable.tableNumber}
                    onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Capacity (Guests)</label>
                  <input
                    type="number"
                    className="mgr-form-input"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({ ...newTable, capacity: Number(e.target.value) })}
                    min={1}
                    max={30}
                    required
                  />
                </div>
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Zone</label>
                  <select
                    className="mgr-form-select"
                    value={newTable.zone}
                    onChange={(e) => setNewTable({ ...newTable, zone: e.target.value as any })}
                  >
                    <option value="Main Dining Hall">Main Dining Hall</option>
                    <option value="Private Dining Lounge">Private Dining Lounge</option>
                    <option value="Terrace Garden">Terrace Garden</option>
                    <option value="Bar Lounge">Bar Lounge</option>
                  </select>
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button type="button" className="mgr-secondary-btn" onClick={() => setIsAddingTable(false)}>
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

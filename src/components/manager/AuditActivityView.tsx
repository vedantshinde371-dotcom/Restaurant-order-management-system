import React, { useState } from 'react';
import type { ManagerAuditLog } from '../../data/mockRestaurantData';
import { SearchIcon, AlertTriangleIcon, CheckIcon } from '../Icons';

interface AuditActivityViewProps {
  logs: ManagerAuditLog[];
}

export const AuditActivityView: React.FC<AuditActivityViewProps> = ({ logs }) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const modules = ['All', 'Billing', 'Menu', 'Inventory', 'Staff', 'Discounts', 'Security'];

  const filteredLogs = logs.filter((log) => {
    const matchesModule = selectedModule === 'All' || log.module === selectedModule;
    const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSeverity && matchesSearch;
  });

  return (
    <div className="mgr-audit-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Audit Trail & Operational Governance</h2>
          <p className="mgr-section-subtitle">
            Immutable system activity register tracking security overrides, bill voids, stock adjustments, and staff changes.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#c9893d', fontWeight: 600 }}>MODULE:</span>
              {modules.map((mod) => (
                <button
                  key={mod}
                  className={`mgr-pill-filter ${selectedModule === mod ? 'active' : ''}`}
                  onClick={() => setSelectedModule(mod)}
                >
                  {mod}
                </button>
              ))}
            </div>

            <div className="mgr-search-box" style={{ width: '260px' }}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search actor or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#a89c90', fontWeight: 600 }}>SEVERITY:</span>
            {['All', 'info', 'warning', 'critical'].map((sev) => (
              <button
                key={sev}
                className={`mgr-pill-filter ${selectedSeverity === sev ? 'active' : ''}`}
                onClick={() => setSelectedSeverity(sev)}
              >
                {sev.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="mgr-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="mgr-table">
            <thead>
              <tr>
                <th>Time & Severity</th>
                <th>Actor & Role</th>
                <th>Module</th>
                <th>Action & Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#f5efe6' }}>
                      {log.timestamp}
                    </div>
                    <span
                      className={`mgr-badge ${
                        log.severity === 'critical'
                          ? 'mgr-badge-critical'
                          : log.severity === 'warning'
                          ? 'mgr-badge-warning'
                          : 'mgr-badge-info'
                      }`}
                      style={{ marginTop: '0.25rem' }}
                    >
                      {log.severity === 'critical' ? (
                        <AlertTriangleIcon />
                      ) : (
                        <CheckIcon />
                      )}
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f5efe6' }}>{log.actor}</div>
                    <span style={{ fontSize: '0.75rem', color: '#a89c90' }}>{log.role}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c9893d' }}>
                      {log.module}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: '0.15rem' }}>
                      {log.action}
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#a89c90', lineHeight: 1.4, margin: 0 }}>
                      {log.details}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

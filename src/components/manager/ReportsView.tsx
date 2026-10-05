import React, { useState } from 'react';
import { type ManagerReportItem, INITIAL_MANAGER_REPORTS } from '../../data/mockRestaurantData';
import { DownloadIcon, RotateCcwIcon, CheckIcon, BarChartIcon } from '../Icons';

interface ReportsViewProps {
  onLogAudit: (action: string, module: 'Billing' | 'Staff' | 'Inventory', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onLogAudit }) => {
  const [reports] = useState<ManagerReportItem[]>(INITIAL_MANAGER_REPORTS);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const filteredReports = reports.filter((rep) => {
    return selectedType === 'all' || rep.type === selectedType;
  });

  const handleDownload = (report: ManagerReportItem, format: 'PDF' | 'CSV') => {
    setDownloadSuccessMessage(`Successfully generated ${format} export for "${report.title}"`);
    onLogAudit(
      'Financial Report Exported',
      'Billing',
      `Exported report "${report.title}" in ${format} format.`,
      'info'
    );
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 3500);
  };

  return (
    <div className="mgr-reports-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Executive Reports & Fiscal Audits</h2>
          <p className="mgr-section-subtitle">
            Statutory Z-reports, GST tax breakdowns, ingredient consumption reconciliations, and staff gratuity audits.
          </p>
        </div>
      </div>

      {downloadSuccessMessage && (
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
          <CheckIcon /> {downloadSuccessMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Audits' },
            { id: 'sales', label: 'Sales & Z-Reports' },
            { id: 'inventory', label: 'Inventory & Wastage' },
            { id: 'staff', label: 'Staff & Gratuities' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`mgr-pill-filter ${selectedType === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedType(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="mgr-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderLeft: '4px solid #c9893d',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    className={`mgr-badge ${
                      report.type === 'sales'
                        ? 'mgr-badge-success'
                        : report.type === 'inventory'
                        ? 'mgr-badge-warning'
                        : 'mgr-badge-info'
                    }`}
                  >
                    {report.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#a89c90' }}>
                    Period: {report.dateRange} • Generated: {report.generatedAt}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f5efe6' }}>
                  {report.title}
                </h3>
              </div>

              {report.totalAmount && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a89c90' }}>Audited Total</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e5a962' }}>
                    ₹{report.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '0.75rem',
                borderRadius: '6px',
              }}
            >
              {report.highlights.map((hl) => (
                <div key={hl} style={{ fontSize: '0.85rem', color: '#f5efe6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#c9893d' }}>•</span> {hl}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '0.75rem',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#6e6259' }}>
                Encrypted File Size: {report.fileSize}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="mgr-secondary-btn"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  onClick={() => handleDownload(report, 'CSV')}
                >
                  <DownloadIcon /> Export CSV
                </button>
                <button
                  type="button"
                  className="mgr-primary-btn"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  onClick={() => handleDownload(report, 'PDF')}
                >
                  <DownloadIcon /> Download Official PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Custom Report Card */}
      <div className="mgr-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f5efe6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChartIcon /> Custom Date Range Reconciliation
        </h3>
        <p style={{ fontSize: '0.825rem', color: '#a89c90', marginBottom: '1rem' }}>
          Query archival dining records and aggregate GST filings for statutory auditing.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="date"
            className="mgr-form-input"
            style={{ width: '180px' }}
            defaultValue="2026-09-01"
          />
          <span style={{ color: '#a89c90' }}>to</span>
          <input
            type="date"
            className="mgr-form-input"
            style={{ width: '180px' }}
            defaultValue="2026-09-25"
          />
          <button
            type="button"
            className="mgr-primary-btn"
            onClick={() => {
              setDownloadSuccessMessage('Custom date range compiled successfully.');
              setTimeout(() => setDownloadSuccessMessage(null), 3000);
            }}
          >
            <RotateCcwIcon /> Compile Custom Ledger
          </button>
        </div>
      </div>
    </div>
  );
};

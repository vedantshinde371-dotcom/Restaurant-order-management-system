import React, { useState } from 'react';
import { type ManagerCustomerReview, INITIAL_MANAGER_REVIEWS } from '../../data/mockRestaurantData';
import { CheckIcon, XIcon, MessageSquareIcon } from '../Icons';

interface CustomerFeedbackViewProps {
  onLogAudit: (action: string, module: 'Staff', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const CustomerFeedbackView: React.FC<CustomerFeedbackViewProps> = ({ onLogAudit }) => {
  const [reviews, setReviews] = useState<ManagerCustomerReview[]>(INITIAL_MANAGER_REVIEWS);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [replyingReview, setReplyingReview] = useState<ManagerCustomerReview | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const filteredReviews = reviews.filter((rev) => {
    return selectedSentiment === 'all' || rev.sentiment === selectedSentiment;
  });

  const handleOpenReply = (rev: ManagerCustomerReview) => {
    setReplyingReview(rev);
    setReplyText(
      rev.managerReply ||
        `Dear ${rev.customerName}, thank you for dining with us at Savoria. We deeply appreciate your valuable feedback.`
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview) return;

    const updated = reviews.map((r) =>
      r.id === replyingReview.id
        ? {
            ...r,
            responseStatus: 'replied' as const,
            managerReply: replyText,
          }
        : r
    );

    setReviews(updated);
    onLogAudit(
      'Manager Feedback Response Sent',
      'Staff',
      `Manager replied to review from ${replyingReview.customerName} (${replyingReview.tableNumber}).`,
      'info'
    );
    setReplyingReview(null);
  };

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="mgr-feedback-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Customer Feedback & Patron Sentiment</h2>
          <p className="mgr-section-subtitle">
            Guest satisfaction ratings across culinary execution, service responsiveness, and dining ambience.
          </p>
        </div>
      </div>

      {/* Ratings Strip */}
      <div className="mgr-kpi-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Overall Guest Score</div>
          <div className="mgr-kpi-value" style={{ color: '#e5a962' }}>
            ★ {avgRating} / 5.0
          </div>
          <div className="mgr-kpi-subtext">Based on {reviews.length} authenticated reviews</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Culinary Rating</div>
          <div className="mgr-kpi-value" style={{ color: '#10b981' }}>
            ★ 4.9
          </div>
          <div className="mgr-kpi-subtext">Taste, temperature & presentation</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Service Rating</div>
          <div className="mgr-kpi-value" style={{ color: '#f59e0b' }}>
            ★ 4.7
          </div>
          <div className="mgr-kpi-subtext">Attentiveness & wait times</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Atmosphere & Ambience</div>
          <div className="mgr-kpi-value" style={{ color: '#c9893d' }}>
            ★ 4.8
          </div>
          <div className="mgr-kpi-subtext">Acoustics & lighting luxury</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'positive', label: 'Positive (5★)' },
            { id: 'neutral', label: 'Neutral (3★ - 4★)' },
            { id: 'negative', label: 'Negative / Attention (1★ - 2★)' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`mgr-pill-filter ${selectedSentiment === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedSentiment(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="mgr-card"
            style={{
              borderLeft:
                rev.sentiment === 'positive'
                  ? '4px solid #10b981'
                  : rev.sentiment === 'neutral'
                  ? '4px solid #f59e0b'
                  : '4px solid #ef4444',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f5efe6' }}>
                    {rev.customerName}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#c9893d' }}>
                    {rev.tableNumber} • Order #{rev.orderId}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a89c90', marginTop: '0.2rem' }}>
                  {rev.date}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e5a962' }}>
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </div>
                <span
                  className={`mgr-badge ${
                    rev.responseStatus === 'replied' ? 'mgr-badge-success' : 'mgr-badge-warning'
                  }`}
                  style={{ marginTop: '0.25rem' }}
                >
                  {rev.responseStatus === 'replied' ? 'REPLIED' : 'RESPONSE PENDING'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#f5efe6', lineHeight: 1.5, margin: '0.75rem 0' }}>
              "{rev.comment}"
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                fontSize: '0.75rem',
                color: '#a89c90',
                padding: '0.4rem 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span>Food: <strong style={{ color: '#e5a962' }}>★ {rev.foodRating}</strong></span>
              <span>Service: <strong style={{ color: '#e5a962' }}>★ {rev.serviceRating}</strong></span>
              <span>Ambience: <strong style={{ color: '#e5a962' }}>★ {rev.ambienceRating}</strong></span>
            </div>

            {/* Manager Reply Display */}
            {rev.managerReply && (
              <div
                style={{
                  background: 'rgba(201, 137, 61, 0.08)',
                  border: '1px solid rgba(201, 137, 61, 0.2)',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  marginTop: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#c9893d', fontWeight: 600, marginBottom: '0.25rem' }}>
                  MANAGEMENT RESPONSE:
                </div>
                <div style={{ fontSize: '0.85rem', color: '#f5efe6', fontStyle: 'italic' }}>
                  "{rev.managerReply}"
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <button
                type="button"
                className="mgr-secondary-btn"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                onClick={() => handleOpenReply(rev)}
              >
                <MessageSquareIcon /> {rev.managerReply ? 'Edit Management Reply' : 'Reply to Guest'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Reply to {replyingReview.customerName}</h3>
              <button className="mgr-icon-btn" onClick={() => setReplyingReview(null)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleSendReply}>
              <div className="mgr-modal-body">
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#a89c90' }}>
                    Guest Comment ({replyingReview.tableNumber}):
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#f5efe6', marginTop: '0.25rem' }}>
                    "{replyingReview.comment}"
                  </div>
                </div>

                <div className="mgr-form-group">
                  <label className="mgr-form-label">Official Executive Response</label>
                  <textarea
                    className="mgr-form-input"
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button type="button" className="mgr-secondary-btn" onClick={() => setReplyingReview(null)}>
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  <CheckIcon /> Publish Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

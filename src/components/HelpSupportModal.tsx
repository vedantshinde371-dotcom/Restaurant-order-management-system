import React, { useState } from 'react';
import {
  MOCK_FAQS,
  RESTAURANT_CONTACT_INFO,
  type ActiveOrder,
} from '../data/mockRestaurantData';
import {
  CloseIcon,
  HelpCircleIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  MessageSquareIcon,
  ClockIcon,
} from './Icons';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: ActiveOrder[];
  onReportSubmitted?: (ticketId: string, issueType: string) => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  orders = [],
  onReportSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'report' | 'contact'>('faqs');

  // FAQs state
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(MOCK_FAQS[0].id);
  const [faqCategory, setFaqCategory] = useState<string>('all');

  // Report Issue state
  const [selectedIssueType, setSelectedIssueType] = useState<
    'missing' | 'incorrect' | 'delayed' | 'billing' | 'other'
  >('missing');
  const [associatedOrderId, setAssociatedOrderId] = useState<string>(
    orders[0]?.id || 'General Inquiry'
  );
  const [issueDescription, setIssueDescription] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    type: string;
  } | null>(null);

  if (!isOpen) return null;

  const filteredFaqs = MOCK_FAQS.filter(
    (faq) => faqCategory === 'all' || faq.category === faqCategory
  );

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) return;

    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticket = {
      id: ticketId,
      type: selectedIssueType,
    };

    setSubmittedTicket(ticket);
    if (onReportSubmitted) {
      onReportSubmitted(ticketId, selectedIssueType);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="help-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Customer Help & Support"
      >
        {/* Header */}
        <div className="help-modal-header">
          <div className="help-header-left">
            <div className="help-icon-badge">
              <HelpCircleIcon size={22} />
            </div>
            <div>
              <h2 className="help-modal-title">Help & Guest Concierge</h2>
              <p className="help-modal-sub">
                Answers, direct hospitality assistance, and dedicated order dispute resolution
              </p>
            </div>
          </div>
          <button
            type="button"
            className="help-close-btn"
            onClick={onClose}
            aria-label="Close help"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="help-tabs-nav" role="tablist">
          <button
            type="button"
            className={`help-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            Frequently Asked Questions
          </button>
          <button
            type="button"
            className={`help-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Report an Order Issue
          </button>
          <button
            type="button"
            className={`help-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Restaurant
          </button>
        </div>

        {/* Body Content */}
        <div className="help-modal-body">
          {/* TAB 1: FAQs */}
          {activeTab === 'faqs' && (
            <div className="help-faqs-tab">
              {/* Category Filter */}
              <div className="faq-category-pills">
                {['all', 'Orders', 'Delivery & Dine-In', 'Payment & Receipts', 'Dietary'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`faq-pill ${faqCategory === cat ? 'active' : ''}`}
                      onClick={() => setFaqCategory(cat)}
                    >
                      {cat === 'all' ? 'All Topics' : cat}
                    </button>
                  )
                )}
              </div>

              {/* Accordion */}
              <div className="faq-accordion-list">
                {filteredFaqs.map((faq) => {
                  const isOpenItem = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`faq-accordion-item ${isOpenItem ? 'open' : ''}`}
                    >
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() =>
                          setExpandedFaqId(isOpenItem ? null : faq.id)
                        }
                      >
                        <span className="faq-question-text">{faq.question}</span>
                        <ChevronDownIcon
                          size={15}
                          className={`faq-chevron ${isOpenItem ? 'rotate' : ''}`}
                        />
                      </button>
                      {isOpenItem && (
                        <div className="faq-answer-pane">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Report an Order Issue */}
          {activeTab === 'report' && (
            <div className="help-report-tab">
              {submittedTicket ? (
                <div className="ticket-success-box">
                  <div className="ticket-success-icon">
                    <CheckCircleIcon size={36} />
                  </div>
                  <h3>Support Ticket Created: #{submittedTicket.id}</h3>
                  <p>
                    Your report regarding{' '}
                    <strong>
                      {submittedTicket.type === 'missing'
                        ? 'Missing Item'
                        : submittedTicket.type === 'incorrect'
                        ? 'Incorrect Item / Wrong Preparation'
                        : submittedTicket.type === 'delayed'
                        ? 'Delayed Delivery'
                        : 'Billing & Payment Concern'}
                    </strong>{' '}
                    has been flagged with highest priority for General Manager Laurent Mercier.
                  </p>
                  <p className="ticket-sub-note">
                    A restaurant manager will contact you via phone or SMS within 5 minutes.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSubmittedTicket(null);
                      setIssueDescription('');
                    }}
                  >
                    Submit Another Report
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitIssue} className="report-issue-form">
                  <div className="report-intro-box">
                    <AlertTriangleIcon size={18} />
                    <span>
                      Need immediate help with your current dining ticket? Choose the issue category below so our floor manager can resolve it promptly.
                    </span>
                  </div>

                  {/* Issue Type Selector */}
                  <div className="form-group">
                    <label className="field-label">Issue Category</label>
                    <div className="issue-types-grid">
                      {[
                        { id: 'missing', label: 'Missing Item' },
                        { id: 'incorrect', label: 'Incorrect Item / Prep' },
                        { id: 'delayed', label: 'Order Delayed' },
                        { id: 'billing', label: 'Billing / Charge Issue' },
                        { id: 'other', label: 'Food Quality Concern' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`issue-type-card ${
                            selectedIssueType === item.id ? 'active' : ''
                          }`}
                          onClick={() =>
                            setSelectedIssueType(
                              item.id as 'missing' | 'incorrect' | 'delayed' | 'billing' | 'other'
                            )
                          }
                        >
                          <span className="issue-radio">
                            {selectedIssueType === item.id && <span className="dot" />}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Associated Order */}
                  <div className="form-group">
                    <label htmlFor="issue-order" className="field-label">
                      Associated Order
                    </label>
                    <select
                      id="issue-order"
                      className="profile-field-input"
                      value={associatedOrderId}
                      onChange={(e) => setAssociatedOrderId(e.target.value)}
                    >
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.id} • {o.items.map((i) => i.name).slice(0, 2).join(', ')} (${o.total.toFixed(2)})
                        </option>
                      ))}
                      <option value="General Inquiry">General Inquiry / No Specific Order</option>
                    </select>
                  </div>

                  {/* Explanation Textarea */}
                  <div className="form-group">
                    <label htmlFor="issue-desc" className="field-label">
                      Describe the problem in detail
                    </label>
                    <textarea
                      id="issue-desc"
                      className="profile-field-input"
                      rows={3}
                      placeholder="Please let us know what went wrong (e.g. sauce was missing, wrong temperature, delayed delivery courier...)"
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-cognac btn-block btn-lg"
                    disabled={!issueDescription.trim()}
                  >
                    <span>Submit Priority Support Ticket</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Contact Restaurant Details */}
          {activeTab === 'contact' && (
            <div className="help-contact-tab">
              <div className="contact-brand-card">
                <h3 className="contact-brand-name">{RESTAURANT_CONTACT_INFO.restaurantName}</h3>
                <p className="contact-brand-sub">Executive Hospitality Desk</p>

                <div className="contact-points-grid">
                  <div className="contact-point-item">
                    <div className="contact-point-icon">
                      <PhoneIcon size={16} />
                    </div>
                    <div>
                      <span className="point-label">Telephone Concierge</span>
                      <a href={`tel:${RESTAURANT_CONTACT_INFO.reservationsPhone}`} className="point-value">
                        {RESTAURANT_CONTACT_INFO.reservationsPhone}
                      </a>
                    </div>
                  </div>

                  <div className="contact-point-item">
                    <div className="contact-point-icon">
                      <MessageSquareIcon size={16} />
                    </div>
                    <div>
                      <span className="point-label">WhatsApp Concierge</span>
                      <span className="point-value">
                        {RESTAURANT_CONTACT_INFO.conciergeWhatsApp}
                      </span>
                    </div>
                  </div>

                  <div className="contact-point-item">
                    <div className="contact-point-icon">
                      <MailIcon size={16} />
                    </div>
                    <div>
                      <span className="point-label">Direct Email</span>
                      <a href={`mailto:${RESTAURANT_CONTACT_INFO.email}`} className="point-value">
                        {RESTAURANT_CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="contact-point-item">
                    <div className="contact-point-icon">
                      <ClockIcon size={16} />
                    </div>
                    <div>
                      <span className="point-label">Operating Hours</span>
                      <span className="point-value">{RESTAURANT_CONTACT_INFO.hours}</span>
                    </div>
                  </div>
                </div>

                <div className="contact-address-box">
                  <MapPinIcon size={18} />
                  <div>
                    <strong>Dining & Valet Address:</strong>
                    <p>{RESTAURANT_CONTACT_INFO.address}</p>
                  </div>
                </div>

                <div className="contact-leadership-row">
                  <div>
                    <span className="leadership-role">General Manager:</span>
                    <strong>{RESTAURANT_CONTACT_INFO.generalManager}</strong>
                  </div>
                  <div>
                    <span className="leadership-role">Executive Chef:</span>
                    <strong>{RESTAURANT_CONTACT_INFO.executiveChef}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

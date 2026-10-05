import React, { useState } from 'react';
import type { TableBooking } from '../data/mockRestaurantData';
import {
  CloseIcon,
  CheckCircleIcon,
  ChefHatIcon,
  PrinterIcon,
  Share2Icon,
  CalendarIcon,
  ClockIcon,
  UsersGroupIcon,
  MapPinIcon,
  QrCodeIcon,
  UtensilsIcon,
  SparklesIcon,
  AlertTriangleIcon,
} from './Icons';
import './TableBookingConfirmationModal.css';

interface TableBookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: TableBooking | null;
  onViewBooking?: (booking: TableBooking) => void;
  onToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const TableBookingConfirmationModal: React.FC<TableBookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onViewBooking,
  onToast,
}) => {
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking.id);
    setCopiedId(true);
    if (onToast) {
      onToast('Booking ID Copied', `Reference ID ${booking.id} copied to clipboard.`, 'info');
    }
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShare = async () => {
    const shareText = `🍽️ Table Booking Confirmation at ${booking.restaurantName}\n` +
      `• Reservation ID: ${booking.id}\n` +
      `• Table: ${booking.tableNumber} (${booking.tableLocation} - ${booking.tableZone})\n` +
      `• Date & Time: ${booking.date} at ${booking.time}\n` +
      `• Guests: ${booking.guestsCount} guests\n` +
      `• Guest: ${booking.customerName}\n` +
      `• Status: ${booking.status}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${booking.restaurantName} - Table Confirmation ${booking.id}`,
          text: shareText,
        });
        if (onToast) {
          onToast('Shared Successfully', 'Booking confirmation shared.', 'success');
        }
        return;
      } catch {
        // Fall back to clipboard if user cancels or share fails
      }
    }

    navigator.clipboard.writeText(shareText);
    if (onToast) {
      onToast('Details Copied', 'Booking confirmation details copied to clipboard to share.', 'success');
    }
  };

  const statusTone =
    booking.status === 'CONFIRMED'
      ? 'status-confirmed'
      : booking.status === 'PENDING'
      ? 'status-pending'
      : 'status-cancelled';

  return (
    <div className="modal-backdrop booking-modal-backdrop" onClick={onClose}>
      <div
        className="booking-confirmation-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Table Booking Confirmation ${booking.id}`}
      >
        {/* Top Control Bar (Hidden in Print) */}
        <div className="booking-modal-controls no-print">
          <div className="booking-modal-status-pill">
            <SparklesIcon size={14} />
            <span>Official Dining Pass</span>
          </div>

          <div className="booking-controls-right">
            <button
              type="button"
              className="ctrl-btn print-ctrl-btn"
              onClick={handlePrint}
              title="Print or Save Official Ticket as PDF"
            >
              <PrinterIcon size={14} />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              className="ctrl-btn share-ctrl-btn"
              onClick={handleShare}
              title="Share Booking Confirmation"
            >
              <Share2Icon size={14} />
              <span>Share</span>
            </button>

            <button
              type="button"
              className="booking-modal-close-btn"
              onClick={onClose}
              aria-label="Close confirmation"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {/* Luxury Official Ticket Card */}
        <div className="booking-ticket-card" id="booking-printable-ticket">
          {/* Header Decoration */}
          <div className="ticket-top-ornament">
            <span className="ornament-line"></span>
            <span className="ornament-diamond">◆</span>
            <span className="ornament-line"></span>
          </div>

          {/* Restaurant Official Header */}
          <header className="ticket-header">
            <div className="ticket-brand-mark">
              <ChefHatIcon size={28} />
              <h2 className="ticket-restaurant-name">{booking.restaurantName || 'SAVORIA RESTAURANT & CELLAR'}</h2>
            </div>
            <p className="ticket-restaurant-tagline">FINE DINING & ARTISANAL CULINARY EXPERIENCE</p>
            <p className="ticket-restaurant-address">
              450 Grand Boulevard, Culinary Arts District, New York, NY 10013
            </p>
            <p className="ticket-restaurant-contact">
              Concierge: +1 (555) 839-2041 • reservations@savoria-dining.com
            </p>
          </header>

          {/* Decorative Perforation Cut Line */}
          <div className="ticket-perforation">
            <div className="perforation-hole left"></div>
            <div className="perforation-dashed-line"></div>
            <div className="perforation-hole right"></div>
          </div>

          {/* Status Ribbon */}
          <div className={`ticket-status-banner ${statusTone}`}>
            <div className="status-banner-inner">
              {booking.status === 'CONFIRMED' && (
                <>
                  <CheckCircleIcon size={18} className="status-icon" />
                  <span className="status-title">TABLE RESERVATION CONFIRMED</span>
                  <span className="status-sub">Guaranteed Seating Allocated</span>
                </>
              )}
              {booking.status === 'PENDING' && (
                <>
                  <ClockIcon size={18} className="status-icon" />
                  <span className="status-title">RESERVATION PENDING VERIFICATION</span>
                  <span className="status-sub">Queueing for Host Table Clearance</span>
                </>
              )}
              {booking.status === 'CANCELLED' && (
                <>
                  <AlertTriangleIcon size={18} className="status-icon" />
                  <span className="status-title">RESERVATION CANCELLED</span>
                  <span className="status-sub">Table Has Been Released</span>
                </>
              )}
            </div>
          </div>

          {/* Hero Reserved Table Spotlight */}
          <div className="ticket-hero-table-box">
            <div className="table-spotlight-left">
              <span className="table-spotlight-label">RESERVED TABLE</span>
              <h1 className="table-spotlight-number">{booking.tableNumber}</h1>
              <span className={`table-location-chip loc-${booking.tableLocation.toLowerCase()}`}>
                {booking.tableLocation === 'Indoor' && '🏛️ Indoor Dining'}
                {booking.tableLocation === 'Outdoor' && '🌿 Garden Terrace'}
                {booking.tableLocation === 'Private' && '👑 Private Cellar'}
              </span>
            </div>

            <div className="table-spotlight-right">
              <div className="table-zone-detail">
                <MapPinIcon size={15} />
                <span>{booking.tableZone}</span>
              </div>
              <div className="table-guests-detail">
                <UsersGroupIcon size={15} />
                <span>{booking.guestsCount} Guests Allocated</span>
              </div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="ticket-details-grid">
            <div className="ticket-grid-item">
              <span className="grid-item-label">
                <CalendarIcon size={13} />
                <span>Date</span>
              </span>
              <strong className="grid-item-value">{booking.date}</strong>
            </div>

            <div className="ticket-grid-item">
              <span className="grid-item-label">
                <ClockIcon size={13} />
                <span>Reservation Time</span>
              </span>
              <strong className="grid-item-value">{booking.time}</strong>
            </div>

            <div className="ticket-grid-item">
              <span className="grid-item-label">
                <UsersGroupIcon size={13} />
                <span>Guest Name</span>
              </span>
              <strong className="grid-item-value">{booking.customerName}</strong>
            </div>

            <div className="ticket-grid-item">
              <span className="grid-item-label">
                <UtensilsIcon size={13} />
                <span>Booking Reference</span>
              </span>
              <div className="grid-item-ref-group">
                <strong className="grid-item-value gold-text">{booking.id}</strong>
                <button
                  type="button"
                  className="copy-ref-btn no-print"
                  onClick={handleCopyId}
                  title="Copy Reference ID"
                >
                  {copiedId ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Special Requests or Dining Note */}
          <div className="ticket-instructions-box">
            <div className="instructions-header">
              <SparklesIcon size={14} />
              <span>Arrival & Host Instructions</span>
            </div>
            <p className="instructions-body">
              {booking.specialRequests ? (
                <>
                  <strong>Guest Note:</strong> {booking.specialRequests}
                  <br />
                </>
              ) : null}
              Please arrive 10 minutes prior to your seating time. Present this digital ticket or reference ID <strong>{booking.id}</strong> to the Maître d’ at the host stand. Tables are held for 15 minutes past reservation time.
            </p>
          </div>

          {/* Ticket Security Verification & QR Code */}
          <div className="ticket-security-footer">
            <div className="security-qr-section">
              <div className="qr-box">
                <QrCodeIcon size={46} />
              </div>
              <div className="qr-meta">
                <span className="qr-title">VALIDATED DINING PASS</span>
                <span className="qr-code-id">{booking.qrCodeValue || `SAVORIA-${booking.id}`}</span>
                <span className="qr-timestamp">Issued: {booking.createdAt}</span>
              </div>
            </div>

            <div className="security-seal-section">
              <div className="gold-seal-badge">
                <div className="seal-inner">
                  <span className="seal-curved">SAVORIA</span>
                  <span className="seal-stars">★ ★ ★</span>
                  <span className="seal-sub">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer (Hidden in Print) */}
        <div className="booking-modal-footer-actions no-print">
          {onViewBooking && (
            <button
              type="button"
              className="btn btn-secondary btn-md view-booking-btn"
              onClick={() => {
                onClose();
                onViewBooking(booking);
              }}
            >
              <span>View in My Bookings</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-md print-action-btn"
            onClick={handlePrint}
          >
            <PrinterIcon size={16} />
            <span>Download / Print Proof</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-md share-action-btn"
            onClick={handleShare}
          >
            <Share2Icon size={16} />
            <span>Share Ticket</span>
          </button>

          <button
            type="button"
            className="btn btn-cognac btn-md done-btn"
            onClick={onClose}
          >
            <span>Done & Continue Dining</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { MailIcon, CloseIcon, CheckCircleIcon, ArrowRightIcon } from './Icons';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (message: string) => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your registered staff or manager email.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmitted(true);
    onSuccessToast(`Password reset link sent to ${email}`);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleResetAndClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleResetAndClose}
          aria-label="Close dialog"
        >
          <CloseIcon size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <div className="modal-icon-badge">
                <MailIcon size={24} />
              </div>
              <h3 id="forgot-password-title" className="modal-title">Reset Restaurant Staff Password</h3>
              <p className="modal-subtitle">
                Enter your registered work email and we will send you secure instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">
                  Work Email Address
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <MailIcon size={18} />
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    className={`form-input ${error ? 'input-error' : ''}`}
                    placeholder="manager@savoria-bistro.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    autoFocus
                  />
                </div>
                {error && <p className="field-error-msg">{error}</p>}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetAndClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Send Reset Link</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="modal-success-content">
            <div className="modal-icon-badge success">
              <CheckCircleIcon size={32} />
            </div>
            <h3 className="modal-title">Reset Link Dispatched</h3>
            <p className="modal-subtitle">
              We've dispatched recovery credentials to <strong>{email}</strong>. Please check your inbox or spam folder.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleResetAndClose}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

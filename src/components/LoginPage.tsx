import React, { useState } from 'react';
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  GoogleIcon,
  MicrosoftIcon,
  CrownIcon,
  UtensilsCrossedIcon,
  ChefHatIcon,
  CashierIcon,
} from './Icons';

interface LoginErrors {
  email?: string;
  password?: string;
}

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onOpenForgotPassword: (email: string) => void;
  onLoginSuccess: (email: string, password?: string) => { success: boolean; error?: string } | void;
  onSocialLogin: (provider: 'Google' | 'Microsoft') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToRegister,
  onOpenForgotPassword,
  onLoginSuccess,
  onSocialLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const demoAccounts = [
    { label: 'Waiter POS', email: 'waiter@savoria.com', role: 'waiter', icon: <UtensilsCrossedIcon size={14} /> },
    { label: 'Cashier POS', email: 'cashier@savoria.com', role: 'cashier', icon: <CashierIcon size={14} /> },
    { label: 'Manager Portal', email: 'manager@savoria.com', role: 'manager', icon: <CrownIcon size={14} /> },
    { label: 'Kitchen KDS', email: 'kitchen@savoria.com', role: 'kitchen', icon: <ChefHatIcon size={14} /> },
  ];

  const handleSelectDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrors({});
    setAuthError(null);
  };

  const validate = () => {
    const newErrors: LoginErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = onLoginSuccess(email, password);
      if (res && !res.success && res.error) {
        setAuthError(res.error);
      }
    }, 450);
  };

  return (
    <div className="auth-card cream-card">
      <div className="auth-card-header">
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">
          Sign in to access your authorized restaurant operational portal.
        </p>
      </div>

      {/* Quick Demo Access Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c9893d', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Select Operational Portal (Demo Credentials):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {demoAccounts.map((acct) => (
            <button
              key={acct.role}
              type="button"
              onClick={() => handleSelectDemo(acct.email)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '20px',
                background: email === acct.email ? 'rgba(201, 137, 61, 0.25)' : 'rgba(20, 15, 12, 0.05)',
                border: email === acct.email ? '1px solid #c9893d' : '1px solid rgba(20, 15, 12, 0.15)',
                color: email === acct.email ? '#854d0e' : '#57463a',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {acct.icon}
              <span>{acct.label}</span>
            </button>
          ))}
        </div>
      </div>

      {authError && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            color: '#dc2626',
            fontSize: '0.825rem',
            marginBottom: '1rem',
            fontWeight: 500,
          }}
        >
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Email Address
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <MailIcon size={18} />
            </span>
            <input
              id="login-email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAuthError(null);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="field-error-msg">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <LockIcon size={18} />
            </span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input pr-button ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password (e.g. password123)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError(null);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {errors.password && <p className="field-error-msg">{errors.password}</p>}
        </div>

        {/* Remember me & Forgot password */}
        <div className="form-row-between">
          <label className="checkbox-label" htmlFor="remember-me">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="custom-checkbox"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            className="text-link forgot-btn"
            onClick={() => onOpenForgotPassword(email)}
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="btn btn-cognac btn-block btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner-wrap">
              <span className="spinner"></span>
              Authenticating role...
            </span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRightIcon size={18} />
            </>
          )}
        </button>

        {/* Or Continue With Divider */}
        <div className="auth-divider">
          <span className="divider-line"></span>
          <span className="divider-text">OR CONTINUE WITH</span>
          <span className="divider-line"></span>
        </div>

        {/* Social Buttons */}
        <div className="social-buttons-row">
          <button
            type="button"
            className="social-btn"
            onClick={() => onSocialLogin('Google')}
          >
            <GoogleIcon size={18} />
            <span>Google</span>
          </button>
          <button
            type="button"
            className="social-btn"
            onClick={() => onSocialLogin('Microsoft')}
          >
            <MicrosoftIcon size={18} />
            <span>Microsoft</span>
          </button>
        </div>

        {/* Link to Registration */}
        <div className="auth-card-footer">
          <p className="footer-text">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-link highlight-link"
              onClick={onNavigateToRegister}
            >
              Register
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

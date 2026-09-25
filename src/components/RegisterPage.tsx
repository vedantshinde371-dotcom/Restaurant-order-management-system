import { useState } from 'react';
import {
  UserIcon,
  UsersGroupIcon,
  ChefHatIcon,
  ClocheWaiterIcon,
  CashierIcon,
  ManagerBadgeIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
} from './Icons';

type AccountType = 'customer' | 'staff';
type StaffRole = 'chef' | 'waiter' | 'cashier' | 'manager';

interface RegisterErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: (fullName: string, email: string, accountType: AccountType, role?: StaffRole) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const [accountType, setAccountType] = useState<AccountType>('customer');
  const [staffRole, setStaffRole] = useState<StaffRole>('chef');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const validate = () => {
    const newErrors: RegisterErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess(
        fullName,
        email,
        accountType,
        accountType === 'staff' ? staffRole : undefined
      );
    }, 700);
  };

  return (
    <div className="auth-card cream-card register-card">
      <div className="auth-card-header">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">
          Join Savoria as a customer or staff member.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Account Type Selection */}
        <div className="account-type-section">
          <label className="section-label">Select Account Type</label>
          <div className="account-type-grid">
            {/* Customer Option */}
            <button
              type="button"
              className={`account-type-card ${accountType === 'customer' ? 'active' : ''}`}
              onClick={() => setAccountType('customer')}
            >
              <div className="account-type-icon-box">
                <UserIcon size={20} />
              </div>
              <div className="account-type-text">
                <span className="account-type-title">Customer</span>
                <span className="account-type-desc">Place orders and enjoy a great dining experience</span>
              </div>
            </button>

            {/* Staff Option */}
            <button
              type="button"
              className={`account-type-card ${accountType === 'staff' ? 'active' : ''}`}
              onClick={() => setAccountType('staff')}
            >
              <div className="account-type-icon-box">
                <UsersGroupIcon size={20} />
              </div>
              <div className="account-type-text">
                <span className="account-type-title">Staff</span>
                <span className="account-type-desc">Join our restaurant team</span>
              </div>
            </button>
          </div>
        </div>

        {/* Staff Role Selection */}
        <div className={`staff-role-section ${accountType === 'customer' ? 'staff-dimmed' : ''}`}>
          <label className="section-label">If you are Staff, select your role</label>
          <div className="staff-roles-grid">
            <button
              type="button"
              className={`role-select-card ${staffRole === 'chef' ? 'selected' : ''}`}
              onClick={() => {
                setStaffRole('chef');
                if (accountType !== 'staff') setAccountType('staff');
              }}
            >
              <div className="role-icon">
                <ChefHatIcon size={22} />
              </div>
              <span className="role-name">Chef</span>
            </button>

            <button
              type="button"
              className={`role-select-card ${staffRole === 'waiter' ? 'selected' : ''}`}
              onClick={() => {
                setStaffRole('waiter');
                if (accountType !== 'staff') setAccountType('staff');
              }}
            >
              <div className="role-icon">
                <ClocheWaiterIcon size={22} />
              </div>
              <span className="role-name">Waiter</span>
            </button>

            <button
              type="button"
              className={`role-select-card ${staffRole === 'cashier' ? 'selected' : ''}`}
              onClick={() => {
                setStaffRole('cashier');
                if (accountType !== 'staff') setAccountType('staff');
              }}
            >
              <div className="role-icon">
                <CashierIcon size={22} />
              </div>
              <span className="role-name">Cashier</span>
            </button>

            <button
              type="button"
              className={`role-select-card ${staffRole === 'manager' ? 'selected' : ''}`}
              onClick={() => {
                setStaffRole('manager');
                if (accountType !== 'staff') setAccountType('staff');
              }}
            >
              <div className="role-icon">
                <ManagerBadgeIcon size={22} />
              </div>
              <span className="role-name">Manager</span>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="reg-fullname" className="form-label">
            Full Name
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <UserIcon size={18} />
            </span>
            <input
              id="reg-fullname"
              type="text"
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              autoComplete="name"
            />
          </div>
          {errors.fullName && <p className="field-error-msg">{errors.fullName}</p>}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="reg-email" className="form-label">
            Email Address
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <MailIcon size={18} />
            </span>
            <input
              id="reg-email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="field-error-msg">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="reg-phone" className="form-label">
            Phone Number
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <PhoneIcon size={18} />
            </span>
            <input
              id="reg-phone"
              type="tel"
              className={`form-input ${errors.phoneNumber ? 'input-error' : ''}`}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
              }}
              autoComplete="tel"
            />
          </div>
          {errors.phoneNumber && <p className="field-error-msg">{errors.phoneNumber}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="reg-password" className="form-label">
            Password
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <LockIcon size={18} />
            </span>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input pr-button ${errors.password ? 'input-error' : ''}`}
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="reg-confirm-password" className="form-label">
            Confirm Password
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <LockIcon size={18} />
            </span>
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`form-input pr-button ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
              title={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
            >
              {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="field-error-msg">{errors.confirmPassword}</p>}
        </div>

        {/* Agreement Checkbox */}
        <div className="form-group">
          <label className="checkbox-label" htmlFor="reg-terms">
            <input
              type="checkbox"
              id="reg-terms"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className="custom-checkbox"
            />
            <span className="terms-text">
              I agree to the <a href="#terms" className="inline-link" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#privacy" className="inline-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </span>
          </label>
          {errors.terms && <p className="field-error-msg">{errors.terms}</p>}
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          className="btn btn-cognac btn-block btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner-wrap">
              <span className="spinner"></span>
              Creating Account...
            </span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRightIcon size={18} />
            </>
          )}
        </button>

        {/* Link Back to Login */}
        <div className="auth-card-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <button
              type="button"
              className="text-link highlight-link"
              onClick={onNavigateToLogin}
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

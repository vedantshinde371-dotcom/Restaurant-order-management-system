import { useState } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { CheckCircleIcon, SparklesIcon, CloseIcon } from './components/Icons';
import './index.css';

interface ToastState {
  show: boolean;
  type: 'success' | 'info';
  title: string;
  message: string;
}

export function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const triggerToast = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    setToast({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleLoginSuccess = (email: string) => {
    triggerToast(
      'Signed In Successfully',
      `Welcome back! Authenticated with ${email}. Terminal session active.`,
      'success'
    );
  };

  const handleSocialLogin = (provider: 'Google' | 'Microsoft') => {
    triggerToast(
      `${provider} Authentication`,
      `Mock OAuth sign-in flow for ${provider} initialized.`,
      'info'
    );
  };

  const handleRegisterSuccess = (
    fullName: string,
    email: string,
    accountType: 'customer' | 'staff',
    role?: string
  ) => {
    const roleLabel = accountType === 'staff' && role ? ` (Staff - ${role.toUpperCase()})` : ' (Customer)';
    triggerToast(
      'Account Created Successfully',
      `Welcome ${fullName}${roleLabel}! Your account for ${email} is ready.`,
      'success'
    );
    setCurrentView('login');
  };

  const handleOpenForgotPassword = (email: string) => {
    setForgotEmail(email);
    setIsForgotModalOpen(true);
  };

  return (
    <>
      <AuthLayout currentView={currentView} onChangeView={setCurrentView}>
        {currentView === 'login' ? (
          <LoginPage
            onNavigateToRegister={() => setCurrentView('register')}
            onOpenForgotPassword={handleOpenForgotPassword}
            onLoginSuccess={handleLoginSuccess}
            onSocialLogin={handleSocialLogin}
          />
        ) : (
          <RegisterPage
            onNavigateToLogin={() => setCurrentView('login')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </AuthLayout>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSuccessToast={(msg) => triggerToast('Reset Email Dispatched', msg, 'info')}
        initialEmail={forgotEmail}
      />

      {/* Floating Interactive Toast Feedback */}
      {toast.show && (
        <div className={`notification-toast toast-${toast.type}`} role="status">
          <div className="toast-icon">
            {toast.type === 'success' ? <CheckCircleIcon size={20} /> : <SparklesIcon size={20} />}
          </div>
          <div className="toast-body">
            <h4 className="toast-title">{toast.title}</h4>
            <p className="toast-message">{toast.message}</p>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            aria-label="Close notification"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      )}
    </>
  );
}

export default App;

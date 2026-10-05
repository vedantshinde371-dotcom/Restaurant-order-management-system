import { useEffect, useState } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { CustomerHomePage } from './components/CustomerHomePage';
import { WaiterDashboard } from './components/waiter/WaiterDashboard';
import { KitchenDashboard } from './components/kitchen/KitchenDashboard';
import { CashierDashboard } from './components/cashier/CashierDashboard';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { MENU_ITEMS } from './data/mockRestaurantData';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  isViewAuthorized,
  getTargetViewForRole,
  type AuthUser,
} from './data/authService';
import {
  CheckCircleIcon,
  SparklesIcon,
  CloseIcon,
} from './components/Icons';
import './index.css';
import './components/waiter/WaiterDashboard.css';
import './components/kitchen/KitchenDashboard.css';
import './components/cashier/CashierDashboard.css';
import './components/manager/ManagerDashboard.css';

interface ToastState {
  show: boolean;
  type: 'success' | 'info';
  title: string;
  message: string;
}

export type AppView =
  | 'customer-home'
  | 'login'
  | 'register'
  | 'waiter-dashboard'
  | 'kitchen-dashboard'
  | 'cashier-dashboard'
  | 'manager-dashboard';

const normalizeRouteString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/^[#/]+/, '')
    .split('?')[0]
    .replace(/\/+$/, '');
};

const getViewFromUrl = (): AppView => {
  if (typeof window === 'undefined') return 'login';

  const hash = normalizeRouteString(window.location.hash);
  const path = normalizeRouteString(window.location.pathname);

  const searchParams = new URLSearchParams(window.location.search);
  let hashSearch = '';
  if (window.location.hash.includes('?')) {
    hashSearch = window.location.hash.slice(window.location.hash.indexOf('?'));
  }
  const hashSearchParams = new URLSearchParams(hashSearch);

  const routeParam = (
    searchParams.get('route') ||
    searchParams.get('view') ||
    searchParams.get('role') ||
    hashSearchParams.get('route') ||
    hashSearchParams.get('view') ||
    hashSearchParams.get('role') ||
    ''
  ).toLowerCase().trim();

  // MANAGER / OWNER
  if (
    hash === 'manager' ||
    hash === 'manager-dashboard' ||
    hash === 'owner' ||
    hash === 'admin' ||
    path === 'manager' ||
    path === 'manager-dashboard' ||
    routeParam === 'manager' ||
    routeParam === 'manager-dashboard' ||
    routeParam === 'owner' ||
    routeParam === 'admin'
  ) {
    return 'manager-dashboard';
  }

  // CASHIER
  if (
    hash === 'cashier' ||
    hash === 'cashier-dashboard' ||
    hash === 'cashier-pos' ||
    hash === 'billing' ||
    path === 'cashier' ||
    path === 'cashier-dashboard' ||
    path === 'billing' ||
    routeParam === 'cashier' ||
    routeParam === 'cashier-dashboard' ||
    routeParam === 'billing' ||
    routeParam === 'pos-cashier'
  ) {
    return 'cashier-dashboard';
  }

  // KITCHEN
  if (
    hash === 'kitchen' ||
    hash === 'kitchen-staff' ||
    hash === 'kitchen-dashboard' ||
    hash === 'kds' ||
    path === 'kitchen' ||
    path === 'kitchen-staff' ||
    path === 'kds' ||
    routeParam === 'kitchen' ||
    routeParam === 'kitchen-staff' ||
    routeParam === 'kds'
  ) {
    return 'kitchen-dashboard';
  }

  // WAITER
  if (
    hash === 'waiter' ||
    hash === 'waiter-dashboard' ||
    hash === 'pos' ||
    hash === 'waiter-pos' ||
    path === 'waiter' ||
    path === 'pos' ||
    routeParam === 'waiter' ||
    routeParam === 'pos'
  ) {
    return 'waiter-dashboard';
  }

  // CUSTOMER
  if (
    hash === 'customer' ||
    hash === 'customer-home' ||
    path === 'customer' ||
    path === 'customer-home' ||
    routeParam === 'customer' ||
    routeParam === 'customer-home'
  ) {
    return 'customer-home';
  }

  // REGISTER
  if (hash === 'register' || path === 'register' || routeParam === 'register') {
    return 'register';
  }

  // DEFAULT (matches root URL http://localhost:5173/ and #login)
  return 'login';
};

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getCurrentUser);
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const raw = getViewFromUrl();
    const user = getCurrentUser();
    const auth = isViewAuthorized(user, raw);
    return auth.authorized
      ? raw
      : ((auth.fallbackView || (user ? getTargetViewForRole(user.role) : 'login')) as AppView);
  });

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

  const navigateToView = (view: AppView, bypassAuth: boolean = false, userOverride?: AuthUser | null) => {
    const activeUser = userOverride !== undefined ? userOverride : (getCurrentUser() || currentUser);
    if (!bypassAuth) {
      const auth = isViewAuthorized(activeUser, view);
      if (!auth.authorized) {
        triggerToast(
          'Access Restricted',
          auth.reason || 'You do not have access to this portal.',
          'info'
        );
        const fallback = (auth.fallbackView || (activeUser ? getTargetViewForRole(activeUser.role) : 'login')) as AppView;
        if (fallback !== currentView) {
          navigateToView(fallback, true, activeUser);
        }
        return;
      }
    }

    setCurrentView(view);
    const targetHash =
      view === 'manager-dashboard'
        ? 'manager'
        : view === 'cashier-dashboard'
        ? 'cashier'
        : view === 'kitchen-dashboard'
        ? 'kitchen'
        : view === 'waiter-dashboard'
        ? 'waiter'
        : view === 'customer-home'
        ? 'customer'
        : view === 'register'
        ? 'register'
        : '';

    if (window.location.hash.replace(/^#[/]?/, '') !== targetHash) {
      if (targetHash) {
        window.location.hash = targetHash;
      } else {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  };

  // React to hash / popstate routing changes with authorization checks
  useEffect(() => {
    const handleLocationChange = () => {
      const requested = getViewFromUrl();
      const activeUser = getCurrentUser() || currentUser;
      const auth = isViewAuthorized(activeUser, requested);
      if (auth.authorized) {
        if (activeUser && activeUser.id !== currentUser?.id) {
          setCurrentUser(activeUser);
        }
        setCurrentView(requested);
      } else {
        triggerToast(
          'Access Restricted',
          auth.reason || 'Unauthorized access attempt intercepted.',
          'info'
        );
        const fallback = (auth.fallbackView || (activeUser ? getTargetViewForRole(activeUser.role) : 'login')) as AppView;
        navigateToView(fallback, true, activeUser);
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Initial mount route check
  useEffect(() => {
    const requested = getViewFromUrl();
    const activeUser = getCurrentUser() || currentUser;
    const auth = isViewAuthorized(activeUser, requested);
    if (!auth.authorized) {
      triggerToast(
        'Access Restricted',
        auth.reason || 'Authentication required to access this portal.',
        'info'
      );
      const fallback = (auth.fallbackView || (activeUser ? getTargetViewForRole(activeUser.role) : 'login')) as AppView;
      navigateToView(fallback, true, activeUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginSuccess = (email: string, password?: string) => {
    const res = loginUser(email, password);
    if (!res.success || !res.user) {
      return { success: false, error: res.error || 'Invalid credentials' };
    }

    const user = res.user;
    setCurrentUser(user);
    const target = getTargetViewForRole(user.role);

    triggerToast(
      'Signed In Successfully',
      `Welcome back, ${user.name}! Role: ${user.role.toUpperCase()}. Redirecting to your dashboard...`,
      'success'
    );

    navigateToView(target, true, user);
    return { success: true };
  };

  const handleSocialLogin = (provider: 'Google' | 'Microsoft') => {
    const res = loginUser('customer@savoria.com');
    if (res.user) {
      setCurrentUser(res.user);
      triggerToast(
        `${provider} Authentication`,
        `Authenticated via ${provider}. Welcome ${res.user.name}!`,
        'success'
      );
      navigateToView('customer-home', true);
    }
  };

  const handleRegisterSuccess = (
    fullName: string,
    email: string,
    accountType: 'customer' | 'staff',
    role?: 'chef' | 'waiter' | 'cashier' | 'manager',
    password?: string,
    phoneNumber?: string
  ) => {
    const res = registerUser(fullName, email, accountType, role, password, phoneNumber);
    if (!res.success || !res.user) {
      triggerToast('Registration Error', res.error || 'Could not complete registration.', 'info');
      return;
    }

    const user = res.user;
    setCurrentUser(user);
    const target = getTargetViewForRole(user.role);

    triggerToast(
      'Account Created Successfully',
      `Welcome ${user.name}! Registered as ${user.role.toUpperCase()}. Redirecting to your dashboard...`,
      'success'
    );

    navigateToView(target, true, user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    triggerToast('Signed Out', 'You have been successfully signed out.', 'info');
    navigateToView('login', true, null);
  };

  const handleOpenForgotPassword = (email: string) => {
    setForgotEmail(email);
    setIsForgotModalOpen(true);
  };

  return (
    <>
      {currentView === 'manager-dashboard' ? (
        <ManagerDashboard
          onNavigateToView={(view) => {
            if (view === 'waiter-dashboard') navigateToView('waiter-dashboard');
            else if (view === 'kitchen-dashboard') navigateToView('kitchen-dashboard');
            else if (view === 'cashier-dashboard') navigateToView('cashier-dashboard');
            else if (view === 'customer') navigateToView('customer-home');
          }}
          onLogout={handleLogout}
        />
      ) : currentView === 'cashier-dashboard' ? (
        <CashierDashboard
          onNavigateToView={(view) => {
            if (view === 'waiter') navigateToView('waiter-dashboard');
            else if (view === 'kitchen') navigateToView('kitchen-dashboard');
            else if (view === 'manager') navigateToView('manager-dashboard');
            else if (view === 'customer') navigateToView('customer-home');
            else if (view === 'login') navigateToView('login');
          }}
          onLogout={handleLogout}
        />
      ) : currentView === 'kitchen-dashboard' ? (
        <KitchenDashboard
          onNavigateToView={(view) => {
            if (view === 'waiter') navigateToView('waiter-dashboard');
            else if (view === 'cashier') navigateToView('cashier-dashboard');
            else if (view === 'manager') navigateToView('manager-dashboard');
            else if (view === 'customer') navigateToView('customer-home');
            else if (view === 'login') navigateToView('login');
          }}
          onLogout={handleLogout}
        />
      ) : currentView === 'waiter-dashboard' ? (
        <WaiterDashboard
          menuItems={MENU_ITEMS}
          onLogout={handleLogout}
        />
      ) : currentView === 'customer-home' ? (
        <CustomerHomePage
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchToAuth={handleLogout}
          onToast={triggerToast}
        />
      ) : (
        <AuthLayout
          currentView={currentView}
          onChangeView={(view) => navigateToView(view)}
        >
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
      )}

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

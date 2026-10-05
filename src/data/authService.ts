export type UserRole = 'customer' | 'waiter' | 'kitchen' | 'cashier' | 'manager';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  password?: string;
  memberTier?: string;
}

export const INITIAL_AUTH_USERS: AuthUser[] = [
  {
    id: 'user-manager-1',
    name: 'Arjun Khanna',
    email: 'manager@savoria.com',
    role: 'manager',
    password: 'password123',
    phone: '+91 98201 11222',
  },
  {
    id: 'user-manager-2',
    name: 'Arjun Khanna',
    email: 'arjun.khanna@savoria.com',
    role: 'manager',
    password: 'password123',
    phone: '+91 98201 11222',
  },
  {
    id: 'user-waiter-1',
    name: 'Marco Rossi',
    email: 'waiter@savoria.com',
    role: 'waiter',
    password: 'password123',
    phone: '+91 98201 77888',
  },
  {
    id: 'user-waiter-2',
    name: 'Marco Rossi',
    email: 'marco.rossi@savoria.com',
    role: 'waiter',
    password: 'password123',
    phone: '+91 98201 77888',
  },
  {
    id: 'user-kitchen-1',
    name: 'Chef Laurent Mercier',
    email: 'kitchen@savoria.com',
    role: 'kitchen',
    password: 'password123',
    phone: '+91 98201 33444',
  },
  {
    id: 'user-kitchen-2',
    name: 'Chef Laurent Mercier',
    email: 'chef@savoria.com',
    role: 'kitchen',
    password: 'password123',
    phone: '+91 98201 33444',
  },
  {
    id: 'user-cashier-1',
    name: 'Priya Sharma',
    email: 'cashier@savoria.com',
    role: 'cashier',
    password: 'password123',
    phone: '+91 98201 99000',
  },
  {
    id: 'user-cashier-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@savoria.com',
    role: 'cashier',
    password: 'password123',
    phone: '+91 98201 99000',
  },
  {
    id: 'user-customer-1',
    name: 'Alexander Vance',
    email: 'customer@savoria.com',
    role: 'customer',
    password: 'password123',
    phone: '+1 (555) 749-2810',
    memberTier: 'Epicurean VIP Gold Club',
  },
  {
    id: 'user-customer-2',
    name: 'Alexander Vance',
    email: 'alexander.vance@savoria-dining.com',
    role: 'customer',
    password: 'password123',
    phone: '+1 (555) 749-2810',
    memberTier: 'Epicurean VIP Gold Club',
  },
];

const STORAGE_USERS_KEY = 'savoria_auth_users';
const STORAGE_CURRENT_USER_KEY = 'savoria_current_user';

export const getStoredUsers = (): AuthUser[] => {
  if (typeof window === 'undefined') return INITIAL_AUTH_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_AUTH_USERS));
      return INITIAL_AUTH_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUTH_USERS;
  }
};

export const saveUsers = (users: AuthUser[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore local storage errors
  }
};

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: AuthUser | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch {
    // ignore
  }
};

export const loginUser = (
  emailInput: string,
  passwordInput?: string
): { success: boolean; user?: AuthUser; error?: string } => {
  const cleanEmail = emailInput.trim().toLowerCase();
  const users = getStoredUsers();

  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!found) {
    // Automatically match role if common domain prefix is used or create guest customer
    if (cleanEmail.includes('manager')) {
      const u = INITIAL_AUTH_USERS[0];
      setCurrentUser(u);
      return { success: true, user: u };
    }
    if (cleanEmail.includes('waiter')) {
      const u = INITIAL_AUTH_USERS[2];
      setCurrentUser(u);
      return { success: true, user: u };
    }
    if (cleanEmail.includes('kitchen') || cleanEmail.includes('chef')) {
      const u = INITIAL_AUTH_USERS[4];
      setCurrentUser(u);
      return { success: true, user: u };
    }
    if (cleanEmail.includes('cashier')) {
      const u = INITIAL_AUTH_USERS[6];
      setCurrentUser(u);
      return { success: true, user: u };
    }

    return {
      success: false,
      error: 'No account registered with this email address. Please register or use a demo account.',
    };
  }

  // If password was provided and user has password, verify it (demo passwords accept 'password123', '123456', or matching)
  if (passwordInput && found.password) {
    if (
      passwordInput !== found.password &&
      passwordInput !== 'password123' &&
      passwordInput !== '123456'
    ) {
      return {
        success: false,
        error: 'Incorrect password. Try password123 or check your credentials.',
      };
    }
  }

  setCurrentUser(found);
  return { success: true, user: found };
};

export const registerUser = (
  fullName: string,
  email: string,
  accountType: 'customer' | 'staff',
  staffRole?: 'chef' | 'waiter' | 'cashier' | 'manager' | 'kitchen',
  password?: string,
  phone?: string
): { success: boolean; user?: AuthUser; error?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email address is already registered. Please sign in.',
    };
  }

  let finalRole: UserRole = 'customer';
  if (accountType === 'staff' || staffRole) {
    if (staffRole === 'chef' || staffRole === 'kitchen') finalRole = 'kitchen';
    else if (staffRole === 'waiter') finalRole = 'waiter';
    else if (staffRole === 'cashier') finalRole = 'cashier';
    else if (staffRole === 'manager') finalRole = 'manager';
  }

  const newUser: AuthUser = {
    id: `usr-${Date.now()}`,
    name: fullName.trim(),
    email: cleanEmail,
    role: finalRole,
    password: password || 'password123',
    phone: phone || '+91 98201 00000',
    memberTier: finalRole === 'customer' ? 'Club Patron' : undefined,
  };

  const updatedUsers = [newUser, ...users];
  saveUsers(updatedUsers);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
};

export const logoutUser = (): void => {
  setCurrentUser(null);
};

export const getTargetHashForRole = (role: UserRole): string => {
  switch (role) {
    case 'manager':
      return 'manager';
    case 'cashier':
      return 'cashier';
    case 'kitchen':
      return 'kitchen';
    case 'waiter':
      return 'waiter';
    case 'customer':
      return 'customer';
    default:
      return '';
  }
};

export const getTargetViewForRole = (role: UserRole): 'customer-home' | 'waiter-dashboard' | 'kitchen-dashboard' | 'cashier-dashboard' | 'manager-dashboard' => {
  switch (role) {
    case 'manager':
      return 'manager-dashboard';
    case 'cashier':
      return 'cashier-dashboard';
    case 'kitchen':
      return 'kitchen-dashboard';
    case 'waiter':
      return 'waiter-dashboard';
    case 'customer':
    default:
      return 'customer-home';
  }
};

export const isViewAuthorized = (
  user: AuthUser | null,
  view: string
): { authorized: boolean; reason?: string; fallbackView?: 'login' | 'customer-home' | 'waiter-dashboard' | 'kitchen-dashboard' | 'cashier-dashboard' | 'manager-dashboard' } => {
  // Public auth pages are always accessible
  if (view === 'login' || view === 'register') {
    return { authorized: true };
  }

  // If no user is logged in, all application views require authentication
  if (!user) {
    return {
      authorized: false,
      reason: 'Authentication required. Please sign in to access this portal.',
      fallbackView: 'login',
    };
  }

  // Manager has full clearance across all portals (executive oversight)
  if (user.role === 'manager') {
    return { authorized: true };
  }

  // Role-specific check
  if (view === 'customer-home' && user.role === 'customer') {
    return { authorized: true };
  }

  if (view === 'waiter-dashboard' && user.role === 'waiter') {
    return { authorized: true };
  }

  if (view === 'kitchen-dashboard' && user.role === 'kitchen') {
    return { authorized: true };
  }

  if (view === 'cashier-dashboard' && user.role === 'cashier') {
    return { authorized: true };
  }

  // If role does not match view:
  const roleDisplayNames: Record<UserRole, string> = {
    customer: 'Customer',
    waiter: 'Waiter',
    kitchen: 'Kitchen Staff',
    cashier: 'Cashier',
    manager: 'Manager',
  };

  return {
    authorized: false,
    reason: `Access Denied: Your account role (${roleDisplayNames[user.role] || user.role}) is not authorized to access this dashboard.`,
    fallbackView: getTargetViewForRole(user.role),
  };
};

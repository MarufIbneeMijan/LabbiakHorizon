import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import AdminLogin from './AdminLogin';

export default function AdminAuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    const hasToken = Boolean(localStorage.getItem('horizon_admin_token'));
    return isAuth && hasToken;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async () => {
      const hasToken = Boolean(localStorage.getItem('horizon_admin_token'));
      const isAuthFlag = localStorage.getItem('isAdminAuthenticated') === 'true';

      if (!hasToken && !isAuthFlag) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await authAPI.verify();
        if (isMounted) {
          if (res.success) {
            localStorage.setItem('isAdminAuthenticated', 'true');
            setIsAuthenticated(true);
            setAdminUser(res.user);
          } else {
            localStorage.removeItem('isAdminAuthenticated');
            authAPI.logout();
            setIsAuthenticated(false);
            setAdminUser(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          // If network failed but token exists offline, allow offline fallback
          const token = localStorage.getItem('horizon_admin_token');
          if (token && token.startsWith('offline_vip_token_')) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
          setIsLoading(false);
        }
      }
    };

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = (user) => {
    localStorage.setItem('isAdminAuthenticated', 'true');
    setIsAuthenticated(true);
    setAdminUser(user);
  };

  const handleLogout = () => {
    authAPI.logout();
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080809] flex flex-col items-center justify-center text-slate-400 font-sans p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] animate-pulse mb-3">
          🕋
        </div>
        <p className="font-serif text-sm text-[#d4af37] tracking-wider uppercase">
          Verifying LabbaikHorizon VIP Security Clearance...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // If authenticated, render full protected admin dashboard
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      adminUser,
      onLogout: handleLogout
    });
  }

  return children;
}

export { AdminAuthGuard as ProtectedRoute };

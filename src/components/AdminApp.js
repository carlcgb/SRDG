import React, { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';
import Login from './Login';
import { isEmailAuthorized } from '../services/dashboardAuthService';

// Email autorisé pour accéder au panel admin
const ADMIN_PANEL_EMAIL = 'carl.g.bisaillon@gmail.com';

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const storedAuth = localStorage.getItem('dashboard_auth');
      if (!storedAuth) {
        setLoading(false);
        return;
      }

      const auth = JSON.parse(storedAuth);
      const userEmail = auth.user?.email;
      
      if (!userEmail) {
        localStorage.removeItem('dashboard_auth');
        setLoading(false);
        return;
      }

      // Check if token is still valid (not expired)
      const tokenAge = Date.now() - auth.timestamp;
      const tokenMaxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (tokenAge >= tokenMaxAge) {
        localStorage.removeItem('dashboard_auth');
        setLoading(false);
        return;
      }

      // Check if user is the authorized admin
      const isAdmin = userEmail.toLowerCase() === ADMIN_PANEL_EMAIL.toLowerCase();
      
      if (isAdmin) {
        // Also check if user has general dashboard access
        const authorized = await isEmailAuthorized(userEmail);
        if (authorized) {
          setAuthData(auth);
          setIsAuthenticated(true);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      localStorage.removeItem('dashboard_auth');
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (auth) => {
    const userEmail = auth.user?.email;
    
    if (!userEmail) {
      return;
    }

    // Check if user is the authorized admin
    const isAdmin = userEmail.toLowerCase() === ADMIN_PANEL_EMAIL.toLowerCase();
    
    if (!isAdmin) {
      alert('Accès refusé. Ce panel est réservé à l\'administrateur principal.');
      return;
    }

    // Check if user has general dashboard access
    const authorized = await isEmailAuthorized(userEmail);
    if (authorized) {
      setAuthData(auth);
      setIsAuthenticated(true);
      setIsAuthorized(true);
    } else {
      alert('Vous devez d\'abord avoir accès au dashboard.');
    }
  };

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="spinner-dashboard"></div>
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated or not authorized
  if (!isAuthenticated || !isAuthorized) {
    return (
      <div>
        <Login onLogin={handleLogin} />
        {!isAuthorized && isAuthenticated && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#dc3545',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
          }}>
            ⚠️ Accès refusé. Ce panel est réservé à l'administrateur principal.
          </div>
        )}
      </div>
    );
  }

  // Show admin panel if authenticated and authorized
  return <AdminPanel authData={authData} onBack={handleBack} />;
}

export default AdminApp;

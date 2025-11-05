import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './components/Dashboard.css';
import './components/Login.css';

// Separate app for dashboard subdomain
function DashboardApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const storedAuth = localStorage.getItem('dashboard_auth');
      if (storedAuth) {
        const auth = JSON.parse(storedAuth);
        // Check if token is still valid (not expired)
        // In production, you should verify the token with your backend
        const tokenAge = Date.now() - auth.timestamp;
        const tokenMaxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (tokenAge < tokenMaxAge) {
          setAuthData(auth);
          setIsAuthenticated(true);
        } else {
          // Token expired, remove it
          localStorage.removeItem('dashboard_auth');
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      localStorage.removeItem('dashboard_auth');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (auth) => {
    setAuthData(auth);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboard_auth');
    setAuthData(null);
    setIsAuthenticated(false);
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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard-app">
      <Dashboard authData={authData} onLogout={handleLogout} />
    </div>
  );
}

export default DashboardApp;


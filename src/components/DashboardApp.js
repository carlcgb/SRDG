import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Login from './Login';
import AccessPending from './AccessPending';
import AdminPanel from './AdminPanel';
import './Dashboard.css';
import './Login.css';
import { isEmailAuthorized, sendAccessRequestEmail, markAsPending, isPendingApproval } from '../services/dashboardAuthService';

// Separate app for dashboard subdomain
function DashboardApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessStatus, setAccessStatus] = useState(null); // 'authorized', 'pending', 'denied', 'request_sent'
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
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
        // Token expired, remove it
        localStorage.removeItem('dashboard_auth');
        setLoading(false);
        return;
      }

      // ALWAYS check if user is authorized, regardless of login method
      // Even admin users with email login must be explicitly authorized
      const authorized = await isEmailAuthorized(userEmail);
      if (authorized) {
        setAuthData(auth);
        setIsAuthenticated(true);
        setAccessStatus('authorized');
      } else {
        const pending = await isPendingApproval(userEmail);
        if (pending) {
          setAuthData(auth);
          setAccessStatus('pending');
        } else {
          // User not authorized, need to request access
          setAccessStatus('not_authorized');
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      localStorage.removeItem('dashboard_auth');
      setAccessStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (auth) => {
    const userEmail = auth.user?.email;
    
    if (!userEmail) {
      setAccessStatus('error');
      return;
    }

    // ALWAYS check if user is authorized before allowing access
    // This applies to BOTH Google login and email/password login
    const authorized = await isEmailAuthorized(userEmail);
    if (authorized) {
      // User is authorized - allow access
      setAuthData(auth);
      setIsAuthenticated(true);
      setAccessStatus('authorized');
    } else {
      // User is NOT authorized - check if already pending
      const pending = await isPendingApproval(userEmail);
      if (pending) {
        // User is pending approval - show pending screen
        setAuthData(auth);
        setAccessStatus('pending');
      } else {
        // User not authorized and not pending - send access request email
        try {
          console.log('📝 New login attempt from unauthorized user:', userEmail);
          console.log('📝 Marking user as pending:', userEmail);
          await markAsPending(userEmail, auth.user?.name);
          console.log('✅ User marked as pending in database');
          
          console.log('📧 Attempting to send access request email...');
          const emailResult = await sendAccessRequestEmail(
            userEmail,
            auth.user?.name,
            auth.user?.picture
          );

          console.log('📧 Email result:', emailResult);
          
          if (emailResult.success) {
            console.log('✅ Email sent successfully, setting status to request_sent');
            setAccessStatus('request_sent');
          } else {
            console.error('❌ Email sending failed, setting status to email_error');
            console.error('Email result details:', emailResult);
            setAccessStatus('email_error');
          }
        } catch (error) {
          console.error('❌ Error sending access request:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          setAccessStatus('email_error');
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboard_auth');
    setAuthData(null);
    setIsAuthenticated(false);
    setAccessStatus(null);
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

  // Show access pending screen if user is pending approval
  if (accessStatus === 'pending') {
    return <AccessPending userEmail={authData?.user?.email} onLogout={handleLogout} />;
  }

  // Show access request sent screen
  if (accessStatus === 'request_sent') {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="access-request-sent">
            <div className="access-icon">✉️</div>
            <h2>Demande d'accès envoyée</h2>
            <p>Votre demande d'accès au tableau de bord a été envoyée à l'administrateur.</p>
            <p><strong>L'administrateur examinera votre demande et vous accordera ou refusera l'accès sous peu.</strong></p>
            <p>Vous serez notifié une fois que votre demande aura été traitée.</p>
            <button onClick={handleLogout} className="btn-logout">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show email error screen
  if (accessStatus === 'email_error') {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <h2>Erreur</h2>
          <p>Impossible d'envoyer la demande d'accès. Veuillez contacter l'administrateur directement.</p>
          <button onClick={handleLogout} className="btn-retry">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || accessStatus !== 'authorized') {
    return <Login onLogin={handleLogin} />;
  }

  // Check if user wants to see admin panel
  const isAdmin = authData?.user?.email?.toLowerCase() === 'carl.g.bisaillon@gmail.com';
  
  // Show admin panel if requested and user is admin
  if (showAdminPanel && isAdmin && isAuthenticated && accessStatus === 'authorized') {
    return (
      <div className="dashboard-app">
        <AdminPanel 
          authData={authData} 
          onBack={() => setShowAdminPanel(false)} 
        />
      </div>
    );
  }

  // Show dashboard if authenticated and authorized
  return (
    <div className="dashboard-app">
      <Dashboard 
        authData={authData} 
        onLogout={handleLogout}
        onShowAdmin={() => {
          if (isAdmin) {
            setShowAdminPanel(true);
          }
        }}
      />
    </div>
  );
}

export default DashboardApp;


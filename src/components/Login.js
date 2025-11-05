import React, { useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loginMethod, setLoginMethod] = React.useState('google'); // 'google' or 'email'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    // Check if client ID is configured
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google Client ID non configuré. Veuillez ajouter REACT_APP_GOOGLE_CLIENT_ID dans le fichier .env et redémarrer le serveur.');
      return;
    }

    // Load Google Sign-In script
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      // Script already loaded, just initialize
      initializeGoogleSignIn();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    script.onerror = () => {
      setError('Erreur lors du chargement du script Google Sign-In. Vérifiez votre connexion internet.');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const scriptToRemove = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, []);

  /**
   * Get OAuth access token for GA4 API
   * Uses Google OAuth2 Token Client to get access token with analytics.readonly scope
   */
  const getOAuthAccessToken = () => {
    return new Promise((resolve, reject) => {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      
      if (!clientId || !window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        reject(new Error('Google OAuth2 not available'));
        return;
      }

      try {
        // Initialize OAuth2 Token Client with Analytics scope
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/analytics.readonly',
          callback: (tokenResponse) => {
            if (tokenResponse.error) {
              console.error('OAuth token error:', tokenResponse.error);
              reject(new Error(tokenResponse.error));
            } else if (tokenResponse.access_token) {
              resolve(tokenResponse.access_token);
            } else {
              reject(new Error('No access token received'));
            }
          },
        });

        // Request access token
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (error) {
        console.error('Error initializing OAuth2 Token Client:', error);
        reject(error);
      }
    });
  };

  const initializeGoogleSignIn = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      setError('Google Client ID non configuré. Veuillez ajouter REACT_APP_GOOGLE_CLIENT_ID dans le fichier .env');
      return;
    }

    if (window.google && window.google.accounts) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          // Clear any existing button
          buttonContainer.innerHTML = '';
          
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            width: 280,
            text: 'signin_with',
            locale: 'fr',
            type: 'standard',
          });
        }

        // Also show the One Tap prompt (optional)
        // window.google.accounts.id.prompt();
      } catch (err) {
        console.error('Error initializing Google Sign-In:', err);
        setError('Erreur lors de l\'initialisation de Google Sign-In: ' + err.message);
      }
    } else {
      setError('Google Sign-In script non chargé. Veuillez réessayer dans quelques secondes.');
    }
  };

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    setError(null);

    try {
      // Validate response
      if (!response || !response.credential) {
        throw new Error('Réponse invalide de Google Sign-In');
      }

      // Decode the JWT token (basic validation)
      // In production, you should verify this token on your backend
      const parts = response.credential.split('.');
      if (parts.length !== 3) {
        throw new Error('Format de token invalide');
      }

      let payload;
      try {
        // Decode base64 URL-safe payload
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        payload = JSON.parse(jsonPayload);
      } catch (decodeError) {
        console.error('Error decoding JWT:', decodeError);
        throw new Error('Impossible de décoder le token de connexion');
      }

      // Validate required fields
      if (!payload.email) {
        throw new Error('Email manquant dans la réponse de connexion');
      }

      // Store authentication info
      const authData = {
        token: response.credential, // JWT token
        user: {
          email: payload.email,
          name: payload.name || payload.given_name || payload.email.split('@')[0],
          picture: payload.picture || '',
        },
        timestamp: Date.now(),
      };

      // Get OAuth access token for GA4 API
      try {
        const accessToken = await getOAuthAccessToken();
        if (accessToken) {
          authData.accessToken = accessToken;
          console.log('✅ OAuth access token obtained for GA4 API');
        }
      } catch (tokenError) {
        console.warn('⚠️ Could not get OAuth access token:', tokenError);
        // Continue without access token - will use mock data or show error
      }

      // Store in localStorage
      localStorage.setItem('dashboard_auth', JSON.stringify(authData));
      
      // Call the onLogin callback (will check authorization)
      await onLogin(authData);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Erreur lors de la connexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  /**
   * Handle email/password login
   */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      // Authenticate with backend
      const apiUrl = `${window.location.origin}/api/auth/login`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la connexion');
      }

      if (!data.success || !data.user) {
        throw new Error('Réponse invalide du serveur');
      }

      // Store authentication info (similar format to Google Sign-In)
      const authData = {
        token: `email_${Date.now()}`, // Simple token for email login
        user: {
          email: data.user.email,
          name: data.user.name || data.user.email,
          picture: '', // No picture for email login
          isAdmin: data.user.isAdmin,
        },
        timestamp: Date.now(),
        loginMethod: 'email',
      };

      // Store in localStorage
      localStorage.setItem('dashboard_auth', JSON.stringify(authData));
      
      // Call the onLogin callback (will check authorization)
      await onLogin(authData);
    } catch (err) {
      console.error('Email login error:', err);
      setError(err.message || 'Erreur lors de la connexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Tableau de Bord</h1>
          <p>La Soirée du Rire de Granby</p>
        </div>
        
        <div className="login-content">
          <div className="login-icon">📊</div>
          <h2>Connexion requise</h2>
          <p className="login-description">
            Veuillez vous connecter pour accéder au tableau de bord Analytics.
          </p>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Login Method Toggle */}
          <div className="login-method-toggle">
            <button
              type="button"
              className={`method-btn ${loginMethod === 'google' ? 'active' : ''}`}
              onClick={() => setLoginMethod('google')}
              disabled={loading}
            >
              Google
            </button>
            <button
              type="button"
              className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
              onClick={() => setLoginMethod('email')}
              disabled={loading}
            >
              Email
            </button>
          </div>

          {/* Google Sign-In */}
          {loginMethod === 'google' && (
            <div className="google-signin-container">
              <div id="google-signin-button"></div>
              {loading && (
                <div className="login-loading">
                  <div className="spinner-login"></div>
                  <p>Connexion en cours...</p>
                </div>
              )}
            </div>
          )}

          {/* Email/Password Login */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="email-login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="btn-login-email"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-login-small"></div>
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="login-footer">
          <p>Accès sécurisé • Données protégées</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

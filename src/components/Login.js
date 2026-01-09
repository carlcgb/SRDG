import React, { useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loginMethod, setLoginMethod] = React.useState('google'); // 'google' or 'email'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [googleScriptLoaded, setGoogleScriptLoaded] = React.useState(false);

  useEffect(() => {
    // Check if client ID is configured
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google Client ID non configuré. Veuillez ajouter REACT_APP_GOOGLE_CLIENT_ID dans le fichier .env et redémarrer le serveur.');
      return;
    }

    // Check if Google OAuth2 is already available
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        setGoogleScriptLoaded(true);
        return true;
      }
      return false;
    };

    // Check if already loaded
    if (checkGoogleLoaded()) {
      return;
    }

    // Load Google OAuth2 script (GSI client)
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkInterval = setInterval(() => {
        if (checkGoogleLoaded()) {
          clearInterval(checkInterval);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!checkGoogleLoaded()) {
          setError('Le script Google OAuth2 prend trop de temps à charger. Veuillez rafraîchir la page.');
        }
      }, 10000);
      
      return () => clearInterval(checkInterval);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google OAuth2 script loaded');
      // Wait a bit for the script to fully initialize
      setTimeout(() => {
        if (checkGoogleLoaded()) {
          setGoogleScriptLoaded(true);
        } else {
          // Retry checking
          const retryInterval = setInterval(() => {
            if (checkGoogleLoaded()) {
              setGoogleScriptLoaded(true);
              clearInterval(retryInterval);
            }
          }, 100);
          
          setTimeout(() => {
            clearInterval(retryInterval);
            if (!checkGoogleLoaded()) {
              setError('Le script Google OAuth2 n\'a pas pu s\'initialiser. Veuillez rafraîchir la page.');
            }
          }, 5000);
        }
      }, 500);
    };
    script.onerror = () => {
      setError('Erreur lors du chargement du script Google OAuth2. Vérifiez votre connexion internet.');
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
   * Unified OAuth2 login - gets all scopes in a single popup
   * Uses Google OAuth2 Token Client with profile, email, and analytics.readonly scopes
   */
  const handleGoogleOAuthLogin = async () => {
    // Prevent multiple simultaneous login attempts
    if (loading) {
      console.log('Login already in progress, ignoring duplicate request');
      return;
    }

    // Check if Google OAuth2 is available
    if (!googleScriptLoaded || !window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      setError('Google OAuth2 n\'est pas encore chargé. Veuillez patienter quelques secondes et réessayer.');
      // Retry checking after a short delay
      setTimeout(() => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
          setGoogleScriptLoaded(true);
          setError(null);
        }
      }, 1000);
      return;
    }

    setLoading(true);
    setError(null);

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      setError('Google Client ID non configuré.');
      setLoading(false);
      return;
    }

    try {
      // Check if we already have a valid token with all required scopes
      let existingToken = null;
      try {
        existingToken = window.google.accounts.oauth2.getTokenResponse();
        if (existingToken && 
            window.google.accounts.oauth2.hasGrantedAllScopes(
              existingToken,
              'https://www.googleapis.com/auth/userinfo.profile',
              'https://www.googleapis.com/auth/userinfo.email',
              'https://www.googleapis.com/auth/analytics.readonly'
            )) {
          // We already have a valid token with all required scopes
          console.log('✅ Using existing OAuth token');
          await completeLoginWithToken(existingToken.access_token);
          return;
        }
      } catch (e) {
        // No existing token, continue to request one
      }

      // Initialize OAuth2 Token Client with ALL required scopes in one request
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/analytics.readonly',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('OAuth token error:', tokenResponse.error);
            setError(`Erreur d'authentification: ${tokenResponse.error}`);
            setLoading(false);
          } else if (tokenResponse.access_token) {
            console.log('✅ OAuth token obtained with all scopes');
            await completeLoginWithToken(tokenResponse.access_token);
          } else {
            setError('Aucun token d\'accès reçu');
            setLoading(false);
          }
        },
      });

      // Request access token - this will open ONE popup with all permissions
      tokenClient.requestAccessToken({ prompt: '' }); // Empty prompt = only show if needed
    } catch (error) {
      console.error('Error initializing OAuth2 Token Client:', error);
      setError('Erreur lors de l\'initialisation de la connexion Google: ' + error.message);
      setLoading(false);
    }
  };

  /**
   * Complete login process with OAuth token
   * Fetches user info from Google API and stores authentication data
   */
  const completeLoginWithToken = async (accessToken) => {
    try {
      // Fetch user info from Google API
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Impossible de récupérer les informations utilisateur');
      }

      const userInfo = await userInfoResponse.json();

      // Store authentication info
      const authData = {
        accessToken: accessToken, // OAuth access token for GA4 API
        user: {
          email: userInfo.email,
          name: userInfo.name || userInfo.given_name || userInfo.email.split('@')[0],
          picture: userInfo.picture || '',
        },
        timestamp: Date.now(),
        loginMethod: 'google',
      };

      // Store in localStorage
      localStorage.setItem('dashboard_auth', JSON.stringify(authData));
      
      // Call the onLogin callback (will check authorization)
      await onLogin(authData);
    } catch (err) {
      console.error('Error completing login:', err);
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

      // Check if response is OK and has JSON content
      const contentType = response.headers.get('content-type');
      let data;
      
      if (!contentType || !contentType.includes('application/json')) {
        // Non-JSON response - get text for debugging
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        throw new Error('Le serveur a retourné une réponse invalide. Vérifiez que l\'API est correctement configurée.');
      }

      // Try to parse JSON response
      try {
        const responseText = await response.text();
        if (!responseText || responseText.trim() === '') {
          throw new Error('Réponse vide du serveur');
        }
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        throw new Error('Erreur lors de la lecture de la réponse du serveur. Vérifiez que l\'API est correctement configurée.');
      }

      if (!response.ok) {
        throw new Error(data?.error || `Erreur ${response.status}: Erreur lors de la connexion`);
      }

      if (!data || !data.success || !data.user) {
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

          {/* Google OAuth Login - Single Popup */}
          {loginMethod === 'google' && (
            <div className="google-signin-container">
              {!googleScriptLoaded && (
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#fff3cd', 
                  border: '2px solid #ffc107', 
                  borderRadius: '10px', 
                  marginBottom: '15px',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: '#856404'
                }}>
                  ⏳ Chargement de Google OAuth2...
                </div>
              )}
              <button
                type="button"
                onClick={handleGoogleOAuthLogin}
                disabled={loading || !googleScriptLoaded}
                className="btn-google-oauth"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#333',
                  backgroundColor: '#fff',
                  border: '2px solid #F64A3E',
                  borderRadius: '9999px',
                  cursor: (loading || !googleScriptLoaded) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !googleScriptLoaded) ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!loading && googleScriptLoaded) {
                    e.target.style.backgroundColor = '#F64A3E';
                    e.target.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && googleScriptLoaded) {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.color = '#333';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner-login-small"></div>
                    Connexion...
                  </>
                ) : !googleScriptLoaded ? (
                  <>
                    <div className="spinner-login-small"></div>
                    Chargement...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <g fill="#000" fillRule="evenodd">
                        <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"/>
                        <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.21 1.18-.84 2.18-1.79 2.85l2.84 2.2c2.02-1.86 3.19-4.6 3.19-7.55z" fill="#4285F4"/>
                        <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"/>
                        <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.96 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"/>
                        <path d="M0 0h18v18H0z" fill="none"/>
                      </g>
                    </svg>
                    Se connecter avec Google
                  </>
                )}
              </button>
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

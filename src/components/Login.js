import React, { useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loginMethod, setLoginMethod] = React.useState('google'); // 'google' or 'email'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [googleScriptLoaded, setGoogleScriptLoaded] = React.useState(false);
  const [mode, setMode] = React.useState('login'); // 'login' or 'request'
  const [requestEmail, setRequestEmail] = React.useState('');
  const [requestName, setRequestName] = React.useState('');
  const [requestPassword, setRequestPassword] = React.useState('');
  const [requestPasswordConfirm, setRequestPasswordConfirm] = React.useState('');
  const [requestSent, setRequestSent] = React.useState(false);
  const [showConsentButton, setShowConsentButton] = React.useState(false);
  const consentResolvedRef = React.useRef(false);

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

  /** Open only the Google consent popup (one modal). Used when silent token failed. */
  const handleOpenConsentOnly = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.oauth2) return;
    setLoading(true);
    setShowConsentButton(false);
    setError(null);
    const scopes = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/analytics.readonly';
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: scopes,
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          setError(`Erreur: ${tokenResponse.error}`);
          setLoading(false);
        } else if (tokenResponse.access_token) {
          await completeLoginWithToken(tokenResponse.access_token);
        } else {
          setError('Aucun token reçu');
          setLoading(false);
        }
      },
    });
    tokenClient.requestAccessToken({ prompt: 'consent' });
  };

  /**
   * Unified OAuth2 login - tries silent first, then shows single "Autoriser" button if needed
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
    setShowConsentButton(false);

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      setError('Google Client ID non configuré.');
      setLoading(false);
      return;
    }

    const scopes = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/analytics.readonly';

    try {
      // 1) Try existing token with all scopes (no popup)
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
          console.log('✅ Using existing OAuth token');
          await completeLoginWithToken(existingToken.access_token);
          return;
        }
      } catch (e) {
        // No existing token
      }

      // 2) Try silent token (prompt: '') – no popup if already consented
      consentResolvedRef.current = false;
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: async (tokenResponse) => {
          if (consentResolvedRef.current) return;
          consentResolvedRef.current = true;
          if (tokenResponse.error) {
            setLoading(false);
            setShowConsentButton(true);
            setError(null);
          } else if (tokenResponse.access_token) {
            await completeLoginWithToken(tokenResponse.access_token);
          } else {
            setLoading(false);
            setShowConsentButton(true);
          }
        },
      });
      tokenClient.requestAccessToken({ prompt: '' });

      // If silent doesn't respond in 2.5s, show single "Autoriser" button (one consent popup)
      setTimeout(() => {
        if (consentResolvedRef.current) return;
        consentResolvedRef.current = true;
        setLoading(false);
        setShowConsentButton(true);
        setError(null);
      }, 2500);
    } catch (error) {
      console.error('Error initializing OAuth2 Token Client:', error);
      setError('Erreur lors de l\'initialisation. Réessayez.');
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
   * Handle access request with Google OAuth
   */
  const handleGoogleAccessRequest = async () => {
    if (loading || !googleScriptLoaded) return;

    setLoading(true);
    setError(null);

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId || !window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      setError('Google OAuth2 n\'est pas encore chargé. Veuillez patienter quelques secondes et réessayer.');
      setLoading(false);
      return;
    }

    try {
      // Get OAuth token to fetch user info
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setError(`Erreur d'authentification: ${tokenResponse.error}`);
            setLoading(false);
          } else if (tokenResponse.access_token) {
            try {
              // Fetch user info
              const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                  'Authorization': `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!userInfoResponse.ok) {
                throw new Error('Impossible de récupérer les informations utilisateur');
              }

              const userInfo = await userInfoResponse.json();
              
              // Send access request
              await sendAccessRequest(userInfo.email, userInfo.name || userInfo.given_name || userInfo.email.split('@')[0], userInfo.picture || '');
            } catch (err) {
              console.error('Error in access request:', err);
              setError(err.message || 'Erreur lors de la demande d\'accès. Veuillez réessayer.');
              setLoading(false);
            }
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: '' });
    } catch (error) {
      console.error('Error initializing OAuth2 Token Client:', error);
      setError('Erreur lors de l\'initialisation de la connexion Google: ' + error.message);
      setLoading(false);
    }
  };

  /**
   * Handle access request with email
   */
  const handleEmailAccessRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!requestEmail || !requestName) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // If password is provided, validate it
      if (requestPassword) {
        if (requestPassword.length < 8) {
          throw new Error('Le mot de passe doit contenir au moins 8 caractères');
        }
        if (requestPassword !== requestPasswordConfirm) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
      }

      // Send access request
      await sendAccessRequest(requestEmail.trim(), requestName.trim(), '');
    } catch (err) {
      console.error('Error in email access request:', err);
      setError(err.message || 'Erreur lors de la demande d\'accès. Veuillez réessayer.');
      setLoading(false);
    }
  };

  /**
   * Send access request to admin
   */
  const sendAccessRequest = async (userEmail, userName, userPicture) => {
    try {
      const { sendAccessRequestEmail, markAsPending } = await import('../services/dashboardAuthService');
      
      console.log('📝 Marking user as pending:', userEmail);
      await markAsPending(userEmail, userName);
      console.log('✅ User marked as pending in database');
      
      console.log('📧 Attempting to send access request email...');
      const emailResult = await sendAccessRequestEmail(userEmail, userName, userPicture);

      console.log('📧 Email result:', emailResult);
      
      if (emailResult.success) {
        console.log('✅ Email sent successfully');
        setRequestSent(true);
        setError(null);
      } else {
        console.error('❌ Email sending failed');
        setError('Impossible d\'envoyer l\'email de demande. Veuillez contacter l\'administrateur directement.');
      }
    } catch (error) {
      console.error('❌ Error sending access request:', error);
      setError('Erreur lors de l\'envoi de la demande d\'accès. Veuillez réessayer.');
    } finally {
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
          <h2>{mode === 'login' ? 'Connexion requise' : 'Demande d\'accès'}</h2>
          <p className="login-description">
            {mode === 'login' 
              ? 'Veuillez vous connecter pour accéder au tableau de bord Analytics.'
              : 'Demandez l\'accès au tableau de bord Analytics. Vous recevrez une notification une fois votre demande approuvée.'}
          </p>

          {/* Mode Toggle - Single button that switches between modes */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <button
              type="button"
              className="method-btn"
              onClick={() => {
                setMode(mode === 'login' ? 'request' : 'login');
                setError(null);
                setRequestSent(false);
              }}
              disabled={loading}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                border: '2px solid #F64A3E',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: mode === 'login' ? '#fff' : '#F64A3E',
                color: mode === 'login' ? '#F64A3E' : '#fff',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = mode === 'login' ? '#F64A3E' : '#d93a2e';
                  e.target.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = mode === 'login' ? '#fff' : '#F64A3E';
                  e.target.style.color = mode === 'login' ? '#F64A3E' : '#fff';
                }
              }}
            >
              {mode === 'login' ? 'Demande d\'accès' : 'Connexion'}
            </button>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {requestSent && (
            <div style={{
              padding: '15px',
              backgroundColor: '#d4edda',
              border: '2px solid #28a745',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'center',
              color: '#155724'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✉️</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Demande envoyée !</h3>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>
                Votre demande d'accès a été envoyée à l'administrateur. 
                Vous recevrez une notification une fois votre demande traitée.
              </p>
            </div>
          )}

          {mode === 'login' && (
            <>
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
                onClick={showConsentButton ? handleOpenConsentOnly : handleGoogleOAuthLogin}
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
                ) : showConsentButton ? (
                  'Autoriser l\'accès Google (Analytics)'
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
            </>
          )}

          {mode === 'request' && (
            <>
              {/* Request Method Toggle */}
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

              {/* Google Access Request */}
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
                    onClick={handleGoogleAccessRequest}
                    disabled={loading || !googleScriptLoaded || requestSent}
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
                      cursor: (loading || !googleScriptLoaded || requestSent) ? 'not-allowed' : 'pointer',
                      opacity: (loading || !googleScriptLoaded || requestSent) ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-login-small"></div>
                        Envoi en cours...
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
                        Demander l'accès avec Google
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Email Access Request Form */}
              {loginMethod === 'email' && (
                <form onSubmit={handleEmailAccessRequest} className="email-login-form">
                  <div className="form-group">
                    <label htmlFor="request-email">Email *</label>
                    <input
                      id="request-email"
                      type="email"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      disabled={loading || requestSent}
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="request-name">Nom complet *</label>
                    <input
                      id="request-name"
                      type="text"
                      value={requestName}
                      onChange={(e) => setRequestName(e.target.value)}
                      placeholder="Votre nom"
                      required
                      disabled={loading || requestSent}
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="request-password">Mot de passe (optionnel)</label>
                    <input
                      id="request-password"
                      type="password"
                      value={requestPassword}
                      onChange={(e) => setRequestPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading || requestSent}
                      autoComplete="new-password"
                    />
                    <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px', display: 'block' }}>
                      Si vous fournissez un mot de passe, un compte sera créé pour vous.
                    </small>
                  </div>
                  {requestPassword && (
                    <div className="form-group">
                      <label htmlFor="request-password-confirm">Confirmer le mot de passe</label>
                      <input
                        id="request-password-confirm"
                        type="password"
                        value={requestPasswordConfirm}
                        onChange={(e) => setRequestPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading || requestSent}
                        autoComplete="new-password"
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn-login-email"
                    disabled={loading || requestSent}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-login-small"></div>
                        Envoi en cours...
                      </>
                    ) : requestSent ? (
                      'Demande envoyée ✓'
                    ) : (
                      'Envoyer la demande d\'accès'
                    )}
                  </button>
                </form>
              )}
            </>
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

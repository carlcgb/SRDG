import React, { useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

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
        });

        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            width: 280,
            text: 'signin_with',
            locale: 'fr',
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
      // Decode the JWT token (basic validation)
      // In production, you should verify this token on your backend
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Store authentication info
      const authData = {
        token: response.credential,
        user: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        },
        timestamp: Date.now(),
      };

      // Store in localStorage
      localStorage.setItem('dashboard_auth', JSON.stringify(authData));
      
      // Call the onLogin callback (will check authorization)
      await onLogin(authData);
    } catch (err) {
      console.error('Login error:', err);
      setError('Erreur lors de la connexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleManualSignIn = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In n\'est pas encore chargé. Veuillez attendre quelques secondes.');
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
            Veuillez vous connecter avec votre compte Google pour accéder au tableau de bord Analytics.
          </p>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="google-signin-container">
            <div id="google-signin-button"></div>
            {loading && (
              <div className="login-loading">
                <div className="spinner-login"></div>
                <p>Connexion en cours...</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleManualSignIn}
            className="btn-manual-signin"
            disabled={loading}
          >
            Afficher la fenêtre de connexion
          </button>
        </div>

        <div className="login-footer">
          <p>Accès sécurisé • Données protégées</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

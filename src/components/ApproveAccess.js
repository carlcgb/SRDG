import React, { useState, useEffect } from 'react';
import { addAuthorizedUser, verifyToken, removeAuthorizedUser } from '../services/dashboardAuthService';
import './AccessPending.css';

const ApproveAccess = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'confirm', 'success', 'error'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [action, setAction] = useState('approve');
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlEmail = urlParams.get('email');
    const urlToken = urlParams.get('token');
    const urlAction = urlParams.get('action') || 'approve';

    setEmail(urlEmail || '');
    setToken(urlToken || '');
    setAction(urlAction);

    const verifyLink = async () => {
      if (!urlEmail || !urlToken) {
        setStatus('error');
        setMessage('Paramètres manquants dans l\'URL.');
        return;
      }

      // Verify token (uses Cloudflare D1 database)
      const isValid = await verifyToken(urlEmail, urlToken);
      if (!isValid) {
        setStatus('error');
        setMessage('Lien invalide ou expiré. Les liens expirent après 24 heures.');
        return;
      }

      // Token is valid, show confirmation page
      setStatus('confirm');
    };

    verifyLink();
  }, []);

  const handleConfirm = async () => {
    if (!email || !token) {
      setStatus('error');
      setMessage('Paramètres manquants.');
      return;
    }

    setProcessing(true);

    try {
      if (action === 'approve') {
        // Approve user access (updates Cloudflare D1 database)
        await addAuthorizedUser(email);
        setStatus('success');
        setMessage(`L'accès a été accordé à ${email}. L'utilisateur peut maintenant se connecter au dashboard.`);
      } else {
        // Deny user access (updates Cloudflare D1 database)
        await removeAuthorizedUser(email);
        setStatus('success');
        setMessage(`L'accès a été refusé pour ${email}.`);
      }
    } catch (error) {
      console.error('Error handling approval:', error);
      setStatus('error');
      setMessage('Erreur lors du traitement de la demande. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="access-pending-container">
      <div className="access-pending-card">
        <div className="access-pending-header">
          <div className="access-pending-icon">
            {status === 'loading' && '⏳'}
            {status === 'confirm' && (action === 'approve' ? '✅' : '❌')}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
          </div>
          <h1>
            {status === 'loading' && 'Vérification...'}
            {status === 'confirm' && action === 'approve' && 'Confirmer l\'approbation'}
            {status === 'confirm' && action === 'deny' && 'Confirmer le refus'}
            {status === 'success' && action === 'approve' && 'Accès approuvé'}
            {status === 'success' && action === 'deny' && 'Accès refusé'}
            {status === 'error' && 'Erreur'}
          </h1>
        </div>

        <div className="access-pending-content">
          {status === 'confirm' && (
            <div className="access-pending-info">
              <p>
                {action === 'approve' 
                  ? `Êtes-vous sûr de vouloir accorder l'accès au dashboard à cet utilisateur ?`
                  : `Êtes-vous sûr de vouloir refuser l'accès au dashboard à cet utilisateur ?`
                }
              </p>
              {email && (
                <p>
                  <strong>Email:</strong> {email}
                </p>
              )}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginTop: '30px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handleConfirm}
                  disabled={processing}
                  style={{
                    padding: '12px 32px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Teko', sans-serif",
                    border: 'none',
                    borderRadius: '50px',
                    backgroundColor: action === 'approve' ? '#28a745' : '#dc3545',
                    color: '#fff',
                    opacity: processing ? 0.6 : 1,
                    minWidth: '150px'
                  }}
                  onMouseEnter={(e) => {
                    if (!processing) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!processing) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {processing ? '⏳ Traitement...' : (action === 'approve' ? '✅ Confirmer' : '❌ Confirmer')}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={processing}
                  style={{
                    padding: '12px 32px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Teko', sans-serif",
                    border: '2px solid #F64A3E',
                    borderRadius: '50px',
                    backgroundColor: 'transparent',
                    color: '#F64A3E',
                    opacity: processing ? 0.6 : 1,
                    minWidth: '150px'
                  }}
                  onMouseEnter={(e) => {
                    if (!processing) {
                      e.target.style.backgroundColor = '#F64A3E';
                      e.target.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!processing) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#F64A3E';
                    }
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {status !== 'confirm' && (
            <div className="access-pending-info">
              <p>{message || 'Chargement...'}</p>
              {email && status !== 'loading' && (
                <p>
                  <strong>Email:</strong> {email}
                </p>
              )}
              {status === 'success' && (
                <button
                  onClick={handleCancel}
                  className="btn-logout-pending"
                  style={{ marginTop: '20px' }}
                >
                  Retour au dashboard
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveAccess;


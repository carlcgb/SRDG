import React, { useState, useEffect } from 'react';
import { addAuthorizedUser, verifyToken, removeAuthorizedUser } from '../services/dashboardAuthService';
import './AccessPending.css';

const ApproveAccess = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const token = urlParams.get('token');
    const action = urlParams.get('action') || 'approve'; // 'approve' or 'deny'

    const handleApproval = async () => {
      if (!email || !token) {
        setStatus('error');
        setMessage('Paramètres manquants dans l\'URL.');
        return;
      }

      // Verify token (uses Cloudflare D1 database)
      const isValid = await verifyToken(email, token);
      if (!isValid) {
        setStatus('error');
        setMessage('Lien invalide ou expiré. Les liens expirent après 24 heures.');
        return;
      }

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
      }
    };

    handleApproval();
  }, []);

  return (
    <div className="access-pending-container">
      <div className="access-pending-card">
        <div className="access-pending-header">
          <div className="access-pending-icon">
            {status === 'loading' && '⏳'}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
          </div>
          <h1>
            {status === 'loading' && 'Traitement en cours...'}
            {status === 'success' && action === 'approve' && 'Accès approuvé'}
            {status === 'success' && action === 'deny' && 'Accès refusé'}
            {status === 'error' && 'Erreur'}
          </h1>
        </div>

        <div className="access-pending-content">
          <div className="access-pending-info">
            <p>{message || 'Chargement...'}</p>
            {email && (
              <p>
                <strong>Email:</strong> {email}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveAccess;


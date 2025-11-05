import React from 'react';
import './AccessPending.css';

const AccessPending = ({ userEmail, onLogout }) => {
  return (
    <div className="access-pending-container">
      <div className="access-pending-card">
        <div className="access-pending-header">
          <div className="access-pending-icon">⏳</div>
          <h1>Accès en attente</h1>
          <p>Votre demande d'accès est en cours de traitement</p>
        </div>

        <div className="access-pending-content">
          <div className="access-pending-info">
            <p>
              <strong>Email:</strong> {userEmail}
            </p>
            <p>
              Votre demande d'accès au tableau de bord a été envoyée à l'administrateur.
              Vous recevrez un email une fois votre demande approuvée.
            </p>
            <p className="access-pending-note">
              Si vous avez déjà reçu une approbation, veuillez vous déconnecter et vous reconnecter.
            </p>
          </div>

          <button onClick={onLogout} className="btn-logout-pending">
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessPending;


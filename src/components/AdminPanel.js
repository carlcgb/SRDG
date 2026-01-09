import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllAccessRequests, updateUser, createUser, updateAccessRequestStatus, deleteAccessRequest } from '../services/cloudflareApiService';
import './AdminPanel.css';

const AdminPanel = ({ authData, onBack }) => {
  const [users, setUsers] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'access'
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', isAdmin: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading admin panel data...');
      const [usersData, requestsData] = await Promise.all([
        getAllUsers(),
        getAllAccessRequests()
      ]);
      console.log('✅ Users loaded:', usersData);
      console.log('✅ Access requests loaded:', requestsData);
      setUsers(usersData || []);
      setAccessRequests(requestsData || []);
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError(`Erreur lors du chargement des données: ${err.message}. Veuillez réessayer.`);
      // Set empty arrays on error to prevent UI issues
      setUsers([]);
      setAccessRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAccess = async (email) => {
    try {
      await updateAccessRequestStatus(email, 'approved', authData?.user?.email);
      await loadData();
    } catch (err) {
      console.error('Error approving access:', err);
      alert('Erreur lors de l\'approbation de l\'accès.');
    }
  };

  const handleDenyAccess = async (email) => {
    try {
      await updateAccessRequestStatus(email, 'denied', authData?.user?.email);
      await loadData();
    } catch (err) {
      console.error('Error denying access:', err);
      alert('Erreur lors du refus de l\'accès.');
    }
  };

  const handleDeleteAccess = async (email) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la demande d'accès pour ${email} ?`)) {
      return;
    }
    try {
      await deleteAccessRequest(email);
      await loadData();
    } catch (err) {
      console.error('Error deleting access:', err);
      alert('Erreur lors de la suppression de la demande.');
    }
  };

  const handleToggleAdmin = async (user) => {
    try {
      await updateUser(user.id, { isAdmin: !user.is_admin });
      await loadData();
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Erreur lors de la modification de l\'utilisateur.');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await updateUser(user.id, { isActive: !user.is_active });
      await loadData();
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Erreur lors de la modification de l\'utilisateur.');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser.email, newUser.password, newUser.name, newUser.isAdmin);
      setShowAddUserModal(false);
      setNewUser({ email: '', password: '', name: '', isAdmin: false });
      await loadData();
    } catch (err) {
      console.error('Error creating user:', err);
      alert(err.message || 'Erreur lors de la création de l\'utilisateur.');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      password: '',
      name: user.name || '',
      isAdmin: user.is_admin === 1
    });
    setShowAddUserModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        email: newUser.email,
        name: newUser.name,
        isAdmin: newUser.isAdmin
      };
      if (newUser.password) {
        // Note: Password update would need a separate endpoint
        alert('La modification du mot de passe nécessite une fonctionnalité séparée.');
      }
      await updateUser(editingUser.id, updates);
      setShowAddUserModal(false);
      setEditingUser(null);
      setNewUser({ email: '', password: '', name: '', isAdmin: false });
      await loadData();
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.message || 'Erreur lors de la modification de l\'utilisateur.');
    }
  };

  const approvedUsers = accessRequests.filter(r => r.status === 'approved');
  const pendingUsers = accessRequests.filter(r => r.status === 'pending');
  const deniedUsers = accessRequests.filter(r => r.status === 'denied');
  
  // Combine dashboard_users and approved access_requests to show all users with access
  const allUsersWithAccess = [
    // Users from dashboard_users table (email/password users)
    ...users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name || '-',
      source: 'dashboard_users',
      isAdmin: u.is_admin === 1,
      isActive: u.is_active === 1,
      created_at: u.created_at,
      last_login: u.last_login,
      status: 'active'
    })),
    // Approved users from access_requests (Google Sign-In users)
    ...approvedUsers.map(r => ({
      id: `access_${r.id}`,
      email: r.email,
      name: r.name || '-',
      source: 'access_requests',
      isAdmin: false,
      isActive: true,
      created_at: r.requested_at,
      last_login: r.reviewed_at,
      status: 'approved',
      reviewed_by: r.reviewed_by
    }))
  ];

  if (loading) {
    return (
      <div className="admin-panel-container">
        <div className="admin-panel-loading">
          <div className="spinner-dashboard"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <h1>Panel d'Administration</h1>
        <button onClick={onBack} className="btn-back">
          ← Retour au Dashboard
        </button>
      </div>

      {error && (
        <div className="admin-panel-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="admin-panel-tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs avec accès ({allUsersWithAccess.length})
        </button>
        <button
          className={activeTab === 'access' ? 'active' : ''}
          onClick={() => setActiveTab('access')}
        >
          Demandes d'accès ({accessRequests.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="admin-panel-content">
          <div className="admin-panel-actions">
            <button 
              onClick={() => { 
                setEditingUser(null); 
                setNewUser({ email: '', password: '', name: '', isAdmin: false }); 
                setShowAddUserModal(true); 
              }} 
              className="btn-add"
            >
              + Ajouter un utilisateur
            </button>
            <button onClick={loadData} className="btn-refresh">
              🔄 Actualiser
            </button>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#d1ecf1',
            border: '2px solid #17a2b8',
            borderRadius: '10px',
            marginBottom: '20px',
            color: '#0c5460'
          }}>
            <strong>📊 Vue d'ensemble :</strong> Cette liste montre tous les utilisateurs ayant accès au dashboard, 
            incluant les utilisateurs email/password et les utilisateurs Google Sign-In approuvés.
          </div>

          {allUsersWithAccess.length === 0 && !loading && (
            <div style={{
              padding: '30px',
              textAlign: 'center',
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '10px',
              marginBottom: '20px',
              color: '#856404'
            }}>
              <p style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>
                ℹ️ Aucun utilisateur avec accès trouvé.
              </p>
              <p style={{ margin: '0', fontSize: '1rem' }}>
                Cliquez sur "Ajouter un utilisateur" pour créer un compte email/password, ou approuvez des demandes d'accès dans l'onglet "Demandes d'accès".
              </p>
            </div>
          )}

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Source</th>
                  <th>Admin</th>
                  <th>Statut</th>
                  <th>Créé le</th>
                  <th>Dernière activité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsersWithAccess.length > 0 ? (
                  allUsersWithAccess.map(user => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          backgroundColor: user.source === 'dashboard_users' ? '#d4edda' : '#cce5ff',
                          color: user.source === 'dashboard_users' ? '#155724' : '#004085'
                        }}>
                          {user.source === 'dashboard_users' ? '📧 Email/Password' : '🔵 Google Sign-In'}
                        </span>
                      </td>
                      <td>
                        {user.source === 'dashboard_users' ? (
                          <button
                            onClick={() => handleToggleAdmin(users.find(u => u.id === user.id))}
                            className={`btn-toggle ${user.isAdmin ? 'active' : ''}`}
                          >
                            {user.isAdmin ? '✅ Oui' : '❌ Non'}
                          </button>
                        ) : (
                          <span style={{ color: '#666' }}>-</span>
                        )}
                      </td>
                      <td>
                        {user.source === 'dashboard_users' ? (
                          <button
                            onClick={() => handleToggleActive(users.find(u => u.id === user.id))}
                            className={`btn-toggle ${user.isActive ? 'active' : ''}`}
                          >
                            {user.isActive ? '✅ Actif' : '❌ Inactif'}
                          </button>
                        ) : (
                          <span style={{ color: '#28a745', fontWeight: '600' }}>✅ Approuvé</span>
                        )}
                      </td>
                      <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('fr-CA') : '-'}</td>
                      <td>{user.last_login ? new Date(user.last_login).toLocaleDateString('fr-CA') : '-'}</td>
                      <td>
                        {user.source === 'dashboard_users' ? (
                          <button onClick={() => handleEditUser(users.find(u => u.id === user.id))} className="btn-edit">
                            ✏️ Modifier
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleDeleteAccess(user.email)} 
                            className="btn-delete"
                            title="Supprimer l'accès"
                          >
                            🗑️ Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem', color: '#666' }}>
                      {loading ? 'Chargement...' : 'Aucun utilisateur avec accès trouvé.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'access' && (
        <div className="admin-panel-content">
          <div className="admin-panel-actions">
            <button onClick={loadData} className="btn-refresh">
              🔄 Actualiser
            </button>
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-number">{approvedUsers.length}</div>
              <div className="stat-label">Approuvés</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pendingUsers.length}</div>
              <div className="stat-label">En attente</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{deniedUsers.length}</div>
              <div className="stat-label">Refusés</div>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Demandé le</th>
                  <th>Révisé le</th>
                  <th>Révisé par</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.email}</td>
                    <td>{request.name || '-'}</td>
                    <td>
                      <span className={`status-badge status-${request.status}`}>
                        {request.status === 'approved' && '✅ Approuvé'}
                        {request.status === 'pending' && '⏳ En attente'}
                        {request.status === 'denied' && '❌ Refusé'}
                      </span>
                    </td>
                    <td>{request.requested_at ? new Date(request.requested_at).toLocaleDateString('fr-CA') : '-'}</td>
                    <td>{request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString('fr-CA') : '-'}</td>
                    <td>{request.reviewed_by || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        {request.status === 'pending' && (
                          <>
                            <button onClick={() => handleApproveAccess(request.email)} className="btn-approve">
                              ✅ Approuver
                            </button>
                            <button onClick={() => handleDenyAccess(request.email)} className="btn-deny">
                              ❌ Refuser
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDeleteAccess(request.email)} className="btn-delete">
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {accessRequests.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Aucune demande d'accès trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => { setShowAddUserModal(false); setEditingUser(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h2>
            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  disabled={!!editingUser}
                />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Mot de passe *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              )}
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newUser.isAdmin}
                    onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                  />
                  Administrateur
                </label>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => { setShowAddUserModal(false); setEditingUser(null); }} className="btn-secondary">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

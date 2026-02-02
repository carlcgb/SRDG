import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import DashboardModal from './DashboardModal';
import { testAdminNavigation } from './AdminButtonTest';
import { PRIMARY_ADMIN_PANEL_EMAIL } from '../services/dashboardAuthService';
import {
  getUsers,
  getSessions,
  getPageViews,
  getBounceRate,
  getAvgSessionDuration,
  getTopPages,
  getTrafficSources,
  getDeviceBreakdown,
  getDateRange,
  getRealtimeActivePages,
  getRealtimeUserLocations,
  getRealtimeTrafficSources,
  requestGa4Consent,
  waitForGoogleScript,
} from '../services/ga4Service';

const Dashboard = ({ authData, onLogout, onShowAdmin }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatBotModalOpen, setChatBotModalOpen] = useState(false);
  const [reauthorizing, setReauthorizing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const rawInsightsUrl = process.env.REACT_APP_MCP_INSIGHTS_URL;
  const base = rawInsightsUrl ? rawInsightsUrl.replace(/\/insights\.?\/?$/i, '').replace(/\/$/, '') : '';
  const insightsUrl = base ? base + '/insights' : '';
  const chatUrl = base ? base + '/chat' : '';

  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text || !chatUrl || chatLoading) return;
    const range = dateRange === 'last365days' ? 'last90days' : dateRange;
    setChatMessages((prev) => [...prev, { role: 'user', content: text }]);
    setChatInput('');
    setChatLoading(true);
    fetch(chatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, date_range: range }),
    })
      .then((res) => res.json())
      .then((body) => {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: body.reply || 'Aucune réponse.' }]);
      })
      .catch((err) => {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Erreur: ' + (err.message || 'réseau') }]);
      })
      .finally(() => setChatLoading(false));
  };

  useEffect(() => {
    if (!insightsUrl || !data) return;
    const range = dateRange === 'last365days' ? 'last90days' : dateRange;
    setInsightLoading(true);
    setInsightError(null);
    fetch(`${insightsUrl}?date_range=${encodeURIComponent(range)}`)
      .then((res) => res.json().then((body) => ({ ok: res.ok, status: res.status, body })))
      .then(({ ok, body }) => {
        setInsight(body.insight ?? body.error ?? 'Aucune insight.');
        if (body.error) setInsightError(body.insight);
        if (!ok && body.error && !body.insight) setInsightError(body.error);
      })
      .catch((err) => {
        const msg = err.message || 'Erreur lors du chargement des insights.';
        const hint = (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network'))
          ? ' Vérifiez REACT_APP_MCP_INSIGHTS_URL (URL complète avec https://) et que le Worker est déployé (npx wrangler deploy).'
          : '';
        setInsightError(msg + hint);
        setInsight(null);
      })
      .finally(() => setInsightLoading(false));
  }, [insightsUrl, dateRange, data]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const propertyId = process.env.REACT_APP_GA4_PROPERTY_ID;
      const isProduction = process.env.NODE_ENV === 'production';
      
      // In production, Property ID is REQUIRED - never use mock data
      if (!propertyId) {
        if (isProduction) {
          // In production, throw error if Property ID is missing
          throw new Error('GA4 Property ID not configured. Please configure REACT_APP_GA4_PROPERTY_ID in your environment variables.');
        } else {
          // In development only, use mock data if Property ID is not configured
          console.warn('⚠️ GA4 Property ID not configured. Using mock data for development only.');
          console.warn('⚠️ NOTE: Mock data will NEVER be used in production.');
          
          const useRealtimeMock = dateRange === 'today';
          let mockData;
          if (useRealtimeMock) {
            // Real-time mock data
            mockData = {
              users: { current: 45, previous: 38, change: 18.4 },
              sessions: { current: 52, previous: 44, change: 18.2 },
              pageViews: { current: 128, previous: 105, change: 21.9 },
              bounceRate: { current: 38.5, previous: 42.1, change: -8.6 },
              avgSessionDuration: { current: '4:12', previous: '3:45', change: 12.0 },
              realtimeActivePages: [
                { path: '/', title: 'Accueil', activeUsers: 12 },
                { path: '/evenements', title: 'Événements', activeUsers: 8 },
                { path: '/corporatif', title: 'Corporatif', activeUsers: 5 },
                { path: '/contact', title: 'Contact', activeUsers: 3 },
              ],
              realtimeLocations: [
                { country: 'Canada', city: 'Montréal', activeUsers: 15, location: 'Montréal, Canada' },
                { country: 'Canada', city: 'Québec', activeUsers: 8, location: 'Québec, Canada' },
                { country: 'Canada', city: 'Granby', activeUsers: 6, location: 'Granby, Canada' },
                { country: 'France', city: 'Paris', activeUsers: 4, location: 'Paris, France' },
              ],
              realtimeTrafficSources: [
                { source: 'Google (organic)', activeUsers: 18, percentage: 40.0 },
                { source: 'Direct', activeUsers: 12, percentage: 26.7 },
                { source: 'Facebook (social)', activeUsers: 8, percentage: 17.8 },
                { source: 'Twitter (social)', activeUsers: 4, percentage: 8.9 },
              ],
              isRealtime: true,
            };
          } else {
            // Standard mock data
            mockData = {
              users: { current: 12450, previous: 11230, change: 10.8 },
              sessions: { current: 18750, previous: 16980, change: 10.4 },
              pageViews: { current: 45230, previous: 38920, change: 16.2 },
              bounceRate: { current: 42.3, previous: 45.1, change: -6.2 },
              avgSessionDuration: { current: '3:45', previous: '3:20', change: 12.5 },
              topPages: [
                { path: '/', views: 12500, change: 8.2 },
                { path: '/evenements', views: 8900, change: 15.3 },
                { path: '/corporatif', views: 6700, change: 12.1 },
                { path: '/contact', views: 3200, change: 5.4 },
              ],
              trafficSources: [
                { source: 'Organic Search', sessions: 8500, percentage: 45.3 },
                { source: 'Direct', sessions: 6200, percentage: 33.1 },
                { source: 'Social Media', sessions: 2800, percentage: 14.9 },
                { source: 'Referral', sessions: 1250, percentage: 6.7 },
              ],
              deviceBreakdown: [
                { device: 'Desktop', sessions: 10200, percentage: 54.4 },
                { device: 'Mobile', sessions: 6800, percentage: 36.3 },
                { device: 'Tablet', sessions: 1750, percentage: 9.3 },
              ],
              isRealtime: false,
            };
          }
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          setData(mockData);
          setLoading(false);
          return;
        }
      }
      
      // Production check: Ensure we're using real data
      if (isProduction) {
        console.log('✅ Production mode: Using real GA4 data only');
      }

      // Get date ranges for current and previous periods
      const { startDate, endDate, previousStartDate, previousEndDate } = getDateRange(dateRange);
      
      // Use Real-time API for today's data
      const useRealtime = dateRange === 'today';

      // Default fallback data for when requests fail
      // These are empty/zero values - NOT mock data
      // In production, if all requests fail, we'll show an error instead
      const defaultData = {
        users: { current: 0, previous: 0, change: 0 },
        sessions: { current: 0, previous: 0, change: 0 },
        pageViews: { current: 0, previous: 0, change: 0 },
        bounceRate: { current: 0, previous: 0, change: 0 },
        avgSessionDuration: { current: '0:00', previous: '0:00', change: 0 },
        topPages: [],
        trafficSources: [],
        deviceBreakdown: [],
        realtimeActivePages: [],
        realtimeLocations: [],
        realtimeTrafficSources: [],
      };

      // For real-time view (today), fetch different data
      let results;
      if (useRealtime) {
        // Real-time data: active pages, locations, traffic sources
        results = await Promise.allSettled([
          getUsers(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getSessions(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getPageViews(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getBounceRate(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getAvgSessionDuration(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getRealtimeActivePages(10), // Real-time active pages
          getRealtimeUserLocations(10), // Real-time user locations
          getRealtimeTrafficSources(10), // Real-time traffic sources
        ]);
      } else {
        // Standard data for historical periods
        results = await Promise.allSettled([
          getUsers(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getSessions(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getPageViews(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getBounceRate(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getAvgSessionDuration(propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime),
          getTopPages(propertyId, startDate, endDate, 50, useRealtime), // Fetch more for modal
          getTrafficSources(propertyId, startDate, endDate, useRealtime),
          getDeviceBreakdown(propertyId, startDate, endDate, useRealtime),
        ]);
      }

      // Extract results with fallback to defaults
      const [
        usersResult,
        sessionsResult,
        pageViewsResult,
        bounceRateResult,
        avgSessionDurationResult,
        realtimeData1Result,
        realtimeData2Result,
        realtimeData3Result,
      ] = results;

      // Combine all data with fallbacks
      let dashboardData;
      if (useRealtime) {
        // Real-time view: use real-time specific data
        dashboardData = {
          users: usersResult.status === 'fulfilled' ? usersResult.value : defaultData.users,
          sessions: sessionsResult.status === 'fulfilled' ? sessionsResult.value : defaultData.sessions,
          pageViews: pageViewsResult.status === 'fulfilled' ? pageViewsResult.value : defaultData.pageViews,
          bounceRate: bounceRateResult.status === 'fulfilled' ? bounceRateResult.value : defaultData.bounceRate,
          avgSessionDuration: avgSessionDurationResult.status === 'fulfilled' 
            ? avgSessionDurationResult.value 
            : defaultData.avgSessionDuration,
          realtimeActivePages: realtimeData1Result.status === 'fulfilled' ? realtimeData1Result.value : [],
          realtimeLocations: realtimeData2Result.status === 'fulfilled' ? realtimeData2Result.value : [],
          realtimeTrafficSources: realtimeData3Result.status === 'fulfilled' ? realtimeData3Result.value : [],
          isRealtime: true,
        };
      } else {
        // Standard view: use historical data
        dashboardData = {
          users: usersResult.status === 'fulfilled' ? usersResult.value : defaultData.users,
          sessions: sessionsResult.status === 'fulfilled' ? sessionsResult.value : defaultData.sessions,
          pageViews: pageViewsResult.status === 'fulfilled' ? pageViewsResult.value : defaultData.pageViews,
          bounceRate: bounceRateResult.status === 'fulfilled' ? bounceRateResult.value : defaultData.bounceRate,
          avgSessionDuration: avgSessionDurationResult.status === 'fulfilled' 
            ? avgSessionDurationResult.value 
            : defaultData.avgSessionDuration,
          topPages: realtimeData1Result.status === 'fulfilled' ? realtimeData1Result.value : defaultData.topPages,
          trafficSources: realtimeData2Result.status === 'fulfilled' 
            ? realtimeData2Result.value 
            : defaultData.trafficSources,
          deviceBreakdown: realtimeData3Result.status === 'fulfilled' 
            ? realtimeData3Result.value 
            : defaultData.deviceBreakdown,
          isRealtime: false,
        };
      }

      // Log any failures for debugging
      const failedRequests = [];
      
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const metricNames = useRealtime 
            ? ['users', 'sessions', 'pageViews', 'bounceRate', 'avgSessionDuration', 'realtimeActivePages', 'realtimeLocations', 'realtimeTrafficSources']
            : ['users', 'sessions', 'pageViews', 'bounceRate', 'avgSessionDuration', 'topPages', 'trafficSources', 'deviceBreakdown'];
          console.warn(`⚠️ Failed to fetch ${metricNames[index]}:`, result.reason);
          failedRequests.push(metricNames[index]);
        }
      });

      // In production, if all critical requests failed, show error instead of empty data
      const criticalMetrics = ['users', 'sessions', 'pageViews'];
      const allCriticalFailed = criticalMetrics.every(metric => failedRequests.includes(metric));
      
      if (isProduction && allCriticalFailed && failedRequests.length >= 3) {
        const firstRejection = results.find((r) => r.status === 'rejected');
        const underlying = firstRejection?.reason?.message || '';
        throw new Error(
          underlying || 'Impossible de charger les données GA4. Veuillez vérifier la configuration et les permissions.'
        );
      }

      setData(dashboardData);
    } catch (err) {
      console.error('Dashboard error:', err);
      
      // Provide more helpful error message
      let errorMessage = err.message || 'Failed to load dashboard data.';
      const isProductionEnv = process.env.NODE_ENV === 'production';
      
      if (err.message && err.message.includes('Property ID not configured')) {
        if (isProductionEnv) {
          errorMessage = 'GA4 Property ID not configured. Please configure REACT_APP_GA4_PROPERTY_ID in your production environment.';
        } else {
          errorMessage = 'GA4 Property ID not configured. Please add REACT_APP_GA4_PROPERTY_ID to your .env file and restart the server.';
        }
      } else if (err.message && (err.message.includes('Authentication failed') || err.message.includes('Credential') || err.message.includes('analytics.readonly'))) {
        errorMessage = 'Authentication failed. Please ensure your Google account has access to GA4 and the analytics.readonly scope is granted.';
      } else if (isProductionEnv) {
        // In production, be more explicit about errors
        errorMessage = `Erreur lors du chargement des données: ${err.message}. Veuillez vérifier la configuration GA4.`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-CA').format(num);
  };

  const formatPercentage = (num) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const floatingBotAndModal = (
    <>
      <button
        type="button"
        className="ai-chat-fab"
        onClick={() => setChatBotModalOpen(true)}
        aria-label="Ouvrir le chat IA"
      >
        <span className="ai-chat-fab-icon" aria-hidden>💬</span>
      </button>
      {chatBotModalOpen && (
        <div
          className="ai-chat-modal-overlay"
          onClick={() => setChatBotModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Chat IA"
        >
          <div className="ai-chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ai-chat-modal-header">
              <h2>💬 Poser une question à l'IA</h2>
              <button
                type="button"
                className="ai-chat-modal-close"
                onClick={() => setChatBotModalOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <div className="ai-chat-modal-body">
              {!insightsUrl ? (
                <div className="ai-insights-setup">
                  <p>Définissez <strong>REACT_APP_MCP_INSIGHTS_URL</strong> (ex. Cloudflare Pages) puis redéployez.</p>
                  <p>Ex. <code>https://my-mcp-server.&lt;subdomain&gt;.workers.dev/insights</code></p>
                </div>
              ) : (
                <>
                  <p className="ai-chat-hint">Posez une question sur vos données GA4 (période sélectionnée). Réponses en français.</p>
                  <div className="ai-chat-messages">
                    {chatMessages.length === 0 && (
                      <div className="ai-chat-empty">Aucun message. Posez une question ci-dessous.</div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`ai-chat-bubble ai-chat-bubble-${msg.role}`}>
                        <div className="ai-chat-bubble-content">{msg.content}</div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="ai-chat-bubble ai-chat-bubble-assistant">
                        <div className="ai-chat-bubble-content">Réflexion…</div>
                      </div>
                    )}
                  </div>
                  <div className="ai-chat-input-row">
                    <input
                      type="text"
                      className="ai-chat-input"
                      placeholder="Ex: Comment améliorer le taux de rebond ?"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                      disabled={chatLoading}
                    />
                    <button
                      type="button"
                      className="ai-chat-send"
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || chatLoading}
                    >
                      Envoyer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="spinner-dashboard"></div>
          <p>Chargement des données...</p>
        </div>
        {floatingBotAndModal}
      </div>
    );
  }

  const handleReauthorizeGa4 = async () => {
    setReauthorizing(true);
    try {
      await waitForGoogleScript(15000);
      const token = await requestGa4Consent();
      if (token) {
        setError(null);
        setLoading(true);
        await loadDashboardData();
      } else {
        setError('Réautorisation annulée ou échouée. Cliquez sur « Se déconnecter et se reconnecter » puis reconnectez-vous avec Google en acceptant l\'accès aux données Analytics.');
      }
    } catch (e) {
      setError(e?.message || 'Réautorisation échouée. Réessayez.');
    } finally {
      setReauthorizing(false);
    }
  };

  if (error) {
    const isGa4Error = error.includes('GA4') || error.includes('Authentication') || error.includes('Property ID') || error.includes('Credential') || error.includes('analytics.readonly');
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <h2>Erreur</h2>
          <p>{error}</p>
          {isGa4Error && (
            <>
              <ul className="dashboard-error-checklist">
              <li>Vérifiez que <strong>REACT_APP_GA4_PROPERTY_ID</strong> est défini au déploiement (secrets GitHub ou variables Cloudflare Pages).</li>
              <li>Dans Google Cloud Console, client OAuth 2.0 : ajoutez <strong>https://stats.lasoireedurire.ca</strong> aux « Origines JavaScript autorisées ».</li>
              <li>Connectez-vous avec un compte Google qui a accès à la propriété GA4 (rôle Lecteur).</li>
              <li>Lors de la connexion Google, acceptez l’accès « Voir vos données Google Analytics ».</li>
            </ul>
              {authData?.loginMethod === 'google' && (
                <>
                  <button
                    type="button"
                    onClick={handleReauthorizeGa4}
                    disabled={reauthorizing}
                    className="btn-retry"
                    style={{ marginTop: '8px', marginRight: '8px' }}
                  >
                    {reauthorizing ? 'Ouverture de Google…' : "Réautoriser l'accès Google Analytics"}
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="btn-retry"
                    style={{ marginTop: '8px', backgroundColor: '#555', borderColor: '#555' }}
                  >
                    Se déconnecter et se reconnecter
                  </button>
                </>
              )}
            </>
          )}
          <button onClick={loadDashboardData} className="btn-retry">
            Réessayer
          </button>
        </div>
        {floatingBotAndModal}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="spinner-dashboard"></div>
          <p>Chargement des données...</p>
        </div>
        {floatingBotAndModal}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>Tableau de Bord Analytics</h1>
          <p>La Soirée du Rire de Granby</p>
          {authData && authData.user && (
            <div className="dashboard-user-info">
              {authData.user.picture && (
                <img 
                  src={authData.user.picture} 
                  alt={authData.user.name}
                  className="user-avatar"
                />
              )}
              <span className="user-name">{authData.user.name}</span>
              {authData.user.email && authData.user.email.toLowerCase() === PRIMARY_ADMIN_PANEL_EMAIL.toLowerCase() && (
                <button 
                  type="button"
                  id="admin-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('🔧 Admin button clicked');
                    
                    // Try callback first (if available - for inline view)
                    if (onShowAdmin && typeof onShowAdmin === 'function') {
                      console.log('🔧 Using callback to show admin panel');
                      onShowAdmin();
                      return;
                    }
                    
                    // Fallback: Navigate to admin route
                    const hostname = window.location.hostname;
                    const isSubdomain = hostname.startsWith('stats.') || hostname.startsWith('dashboard.');
                    const adminPath = isSubdomain ? '/admin' : '/dashboard/admin';
                    const fullAdminUrl = window.location.origin + adminPath;
                    
                    console.log('🔧 Navigating to:', adminPath);
                    console.log('🔧 Full URL:', fullAdminUrl);
                    
                    // Force navigation with replace to avoid back button issues
                    window.location.replace(fullAdminUrl);
                  }} 
                  className="btn-admin"
                >
                  ⚙️ Admin
                </button>
              )}
              <button onClick={onLogout} className="btn-logout">
                Déconnexion
              </button>
            </div>
          )}
        </div>
        <div className="dashboard-controls">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="today">Aujourd'hui</option>
            <option value="last7days">7 derniers jours</option>
            <option value="last30days">30 derniers jours</option>
            <option value="last90days">90 derniers jours</option>
            <option value="last365days">12 derniers mois</option>
          </select>
          {dateRange === 'today' && (
            <div className="realtime-indicator" style={{ marginTop: '10px', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
              📊 Données en temps réel (certaines métriques peuvent avoir un délai de traitement)
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Utilisateurs</h3>
            <div className="stat-value">{formatNumber(data.users.current)}</div>
            <div className={`stat-change ${data.users.change > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data.users.change)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Sessions</h3>
            <div className="stat-value">{formatNumber(data.sessions.current)}</div>
            <div className={`stat-change ${data.sessions.change > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data.sessions.change)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👀</div>
          <div className="stat-content">
            <h3>Pages vues</h3>
            <div className="stat-value">{formatNumber(data.pageViews.current)}</div>
            <div className={`stat-change ${data.pageViews.change > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data.pageViews.change)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Durée moyenne</h3>
            <div className="stat-value">{data.avgSessionDuration.current}</div>
            <div className={`stat-change ${data.avgSessionDuration.change > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data.avgSessionDuration.change)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📉</div>
          <div className="stat-content">
            <h3>Taux de rebond</h3>
            <div className="stat-value">{data.bounceRate.current.toFixed(1)}%</div>
            <div className={`stat-change ${data.bounceRate.change > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data.bounceRate.change)}
            </div>
          </div>
        </div>
      </div>

      <div className="chart-card ai-insights-card">
        <div className="chart-card-header">
          <h2>🤖 Insights IA (Google Analytics)</h2>
          {insightsUrl && insightLoading && <span className="insight-loading">Chargement…</span>}
        </div>
        <div className="ai-insights-content">
          {!insightsUrl ? (
            <div className="ai-insights-setup">
              <p>Pour afficher les insights IA et le chat, configurez la variable d’environnement <strong>REACT_APP_MCP_INSIGHTS_URL</strong> dans votre projet (ex. Cloudflare Pages).</p>
              <p>Exemple : <code>https://my-mcp-server.&lt;votre-subdomain&gt;.workers.dev/insights</code></p>
              <p>Après configuration, redéployez le site. Voir <code>docs/MCP_CURSOR_SETUP.md</code>.</p>
            </div>
          ) : insightLoading && !insight ? (
            <div className="insight-placeholder">Analyse des données en cours…</div>
          ) : insightError && !insightLoading ? (
            <div className="insight-error">{insightError}</div>
          ) : insight && !insightLoading ? (
            <div className="insight-text">{insight}</div>
          ) : null}
        </div>
      </div>

      <div className="dashboard-charts-grid">
        {data.isRealtime ? (
          <>
            {/* Real-time view: Active pages, Locations, Traffic sources */}
            <div 
              className="chart-card chart-card-clickable" 
              onClick={() => {
                setModalData(data.realtimeActivePages);
                setModalType('realtimeActivePages');
                setModalTitle('Pages actuellement visitées');
                setModalOpen(true);
              }}
            >
              <div className="chart-card-header">
                <h2>📱 Pages actuellement visitées</h2>
                <span className="chart-card-expand">Voir tout →</span>
              </div>
              <div className="top-pages-list">
                {data.realtimeActivePages && data.realtimeActivePages.length > 0 ? (
                  data.realtimeActivePages.slice(0, 5).map((page, index) => (
                    <div key={index} className="top-page-item">
                      <div className="page-rank">#{index + 1}</div>
                      <div className="page-info">
                        <div className="page-path" title={page.title}>{page.path}</div>
                        <div className="page-stats">
                          <span className="page-views" style={{ color: '#28a745', fontWeight: '600' }}>
                            👥 {formatNumber(page.activeUsers)} actifs
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Aucune page actuellement visitée
                  </div>
                )}
              </div>
            </div>

            <div 
              className="chart-card chart-card-clickable" 
              onClick={() => {
                setModalData(data.realtimeLocations);
                setModalType('realtimeLocations');
                setModalTitle('Localisation des utilisateurs actifs');
                setModalOpen(true);
              }}
            >
              <div className="chart-card-header">
                <h2>🌍 Localisation des utilisateurs</h2>
                <span className="chart-card-expand">Voir tout →</span>
              </div>
              <div className="traffic-sources-list">
                {data.realtimeLocations && data.realtimeLocations.length > 0 ? (
                  data.realtimeLocations.slice(0, 5).map((location, index) => {
                    const totalUsers = data.realtimeLocations.reduce((sum, loc) => sum + loc.activeUsers, 0);
                    const percentage = totalUsers > 0 ? (location.activeUsers / totalUsers) * 100 : 0;
                    return (
                      <div key={index} className="traffic-source-item">
                        <div className="source-header">
                          <span className="source-name">{location.location}</span>
                          <span className="source-percentage">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="source-bar-container">
                          <div 
                            className="source-bar" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="source-sessions">{formatNumber(location.activeUsers)} utilisateurs actifs</div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Aucune localisation disponible
                  </div>
                )}
              </div>
            </div>

            <div 
              className="chart-card chart-card-clickable" 
              onClick={() => {
                setModalData(data.realtimeTrafficSources);
                setModalType('realtimeTrafficSources');
                setModalTitle('Sources de trafic en temps réel');
                setModalOpen(true);
              }}
            >
              <div className="chart-card-header">
                <h2>🔗 Sources de trafic en temps réel</h2>
                <span className="chart-card-expand">Voir tout →</span>
              </div>
              <div className="traffic-sources-list">
                {data.realtimeTrafficSources && data.realtimeTrafficSources.length > 0 ? (
                  data.realtimeTrafficSources.slice(0, 5).map((source, index) => (
                    <div key={index} className="traffic-source-item">
                      <div className="source-header">
                        <span className="source-name">{source.source}</span>
                        <span className="source-percentage">{source.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="source-bar-container">
                        <div 
                          className="source-bar" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <div className="source-sessions">{formatNumber(source.activeUsers)} utilisateurs actifs</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Aucune source de trafic disponible
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Standard view: Top pages, Traffic sources, Devices */}
            <div 
              className="chart-card chart-card-clickable" 
              onClick={() => {
                setModalData(data.topPages);
                setModalType('topPages');
                setModalTitle('Pages les plus visitées');
                setModalOpen(true);
              }}
            >
              <div className="chart-card-header">
                <h2>Pages les plus visitées</h2>
                <span className="chart-card-expand">Voir tout →</span>
              </div>
              <div className="top-pages-list">
                {data.topPages && data.topPages.length > 0 ? (
                  data.topPages.slice(0, 5).map((page, index) => (
                    <div key={index} className="top-page-item">
                      <div className="page-rank">#{index + 1}</div>
                      <div className="page-info">
                        <div className="page-path">{page.path}</div>
                        <div className="page-stats">
                          <span className="page-views">{formatNumber(page.views)} vues</span>
                          {page.change !== undefined && (
                            <span className={`page-change ${page.change > 0 ? 'positive' : 'negative'}`}>
                              {formatPercentage(page.change)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </div>

            <div 
              className="chart-card chart-card-clickable" 
              onClick={() => {
                setModalData(data.trafficSources);
                setModalType('trafficSources');
                setModalTitle('Sources de trafic');
                setModalOpen(true);
              }}
            >
              <div className="chart-card-header">
                <h2>Sources de trafic</h2>
                <span className="chart-card-expand">Voir tout →</span>
              </div>
              <div className="traffic-sources-list">
                {data.trafficSources && data.trafficSources.length > 0 ? (
                  data.trafficSources.slice(0, 5).map((source, index) => (
                    <div key={index} className="traffic-source-item">
                      <div className="source-header">
                        <span className="source-name">{source.source}</span>
                        <span className="source-percentage">{source.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="source-bar-container">
                        <div 
                          className="source-bar" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <div className="source-sessions">{formatNumber(source.sessions)} sessions</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </div>

            <div 
              className="chart-card chart-card-clickable" 
              onClick={() => {
                setModalData(data.deviceBreakdown);
                setModalType('deviceBreakdown');
                setModalTitle('Appareils');
                setModalOpen(true);
              }}
            >
              <div className="chart-card-header">
                <h2>Appareils</h2>
                <span className="chart-card-expand">Voir tout →</span>
              </div>
              <div className="device-breakdown">
                {data.deviceBreakdown && data.deviceBreakdown.length > 0 ? (
                  data.deviceBreakdown.slice(0, 5).map((device, index) => (
                    <div key={index} className="device-item">
                      <div className="device-header">
                        <span className="device-name">{device.device}</span>
                        <span className="device-percentage">{device.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="device-bar-container">
                        <div 
                          className="device-bar" 
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <div className="device-sessions">{formatNumber(device.sessions)} sessions</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {floatingBotAndModal}

      {/* Modal for detailed view */}
      <DashboardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalData}
        type={modalType}
      />
    </div>
  );
};

export default Dashboard;


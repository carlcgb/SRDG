import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import DashboardModal from './DashboardModal';
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
} from '../services/ga4Service';

const Dashboard = ({ authData, onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const propertyId = process.env.REACT_APP_GA4_PROPERTY_ID;
      
      // If Property ID is not configured, use mock data for development
      if (!propertyId) {
        console.warn('⚠️ GA4 Property ID not configured. Using mock data.');
        
        // Use mock data for development
        const mockData = {
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
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
        setLoading(false);
        return;
      }

      // Get date ranges for current and previous periods
      const { startDate, endDate, previousStartDate, previousEndDate } = getDateRange(dateRange);

      // Default fallback data for when requests fail
      const defaultData = {
        users: { current: 0, previous: 0, change: 0 },
        sessions: { current: 0, previous: 0, change: 0 },
        pageViews: { current: 0, previous: 0, change: 0 },
        bounceRate: { current: 0, previous: 0, change: 0 },
        avgSessionDuration: { current: '0:00', previous: '0:00', change: 0 },
        topPages: [],
        trafficSources: [],
        deviceBreakdown: [],
      };

      // Fetch all metrics in parallel - use allSettled to handle partial failures
      const results = await Promise.allSettled([
        getUsers(propertyId, startDate, endDate, previousStartDate, previousEndDate),
        getSessions(propertyId, startDate, endDate, previousStartDate, previousEndDate),
        getPageViews(propertyId, startDate, endDate, previousStartDate, previousEndDate),
        getBounceRate(propertyId, startDate, endDate, previousStartDate, previousEndDate),
        getAvgSessionDuration(propertyId, startDate, endDate, previousStartDate, previousEndDate),
        getTopPages(propertyId, startDate, endDate, 50), // Fetch more for modal
        getTrafficSources(propertyId, startDate, endDate),
        getDeviceBreakdown(propertyId, startDate, endDate),
      ]);

      // Extract results with fallback to defaults
      const [
        usersResult,
        sessionsResult,
        pageViewsResult,
        bounceRateResult,
        avgSessionDurationResult,
        topPagesResult,
        trafficSourcesResult,
        deviceBreakdownResult,
      ] = results;

      // Combine all data with fallbacks
      const dashboardData = {
        users: usersResult.status === 'fulfilled' ? usersResult.value : defaultData.users,
        sessions: sessionsResult.status === 'fulfilled' ? sessionsResult.value : defaultData.sessions,
        pageViews: pageViewsResult.status === 'fulfilled' ? pageViewsResult.value : defaultData.pageViews,
        bounceRate: bounceRateResult.status === 'fulfilled' ? bounceRateResult.value : defaultData.bounceRate,
        avgSessionDuration: avgSessionDurationResult.status === 'fulfilled' 
          ? avgSessionDurationResult.value 
          : defaultData.avgSessionDuration,
        topPages: topPagesResult.status === 'fulfilled' ? topPagesResult.value : defaultData.topPages,
        trafficSources: trafficSourcesResult.status === 'fulfilled' 
          ? trafficSourcesResult.value 
          : defaultData.trafficSources,
        deviceBreakdown: deviceBreakdownResult.status === 'fulfilled' 
          ? deviceBreakdownResult.value 
          : defaultData.deviceBreakdown,
      };

      // Log any failures for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const metricNames = ['users', 'sessions', 'pageViews', 'bounceRate', 'avgSessionDuration', 'topPages', 'trafficSources', 'deviceBreakdown'];
          console.warn(`⚠️ Failed to fetch ${metricNames[index]}:`, result.reason);
        }
      });

      setData(dashboardData);
    } catch (err) {
      console.error('Dashboard error:', err);
      
      // Provide more helpful error message
      let errorMessage = err.message || 'Failed to load dashboard data.';
      
      if (err.message && err.message.includes('Property ID not configured')) {
        errorMessage = 'GA4 Property ID not configured. Please add REACT_APP_GA4_PROPERTY_ID to your .env file and restart the server.';
      } else if (err.message && err.message.includes('Authentication failed')) {
        errorMessage = 'Authentication failed. Please ensure your Google account has access to GA4 and the analytics.readonly scope is granted.';
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

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="spinner-dashboard"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="btn-retry">
            Réessayer
          </button>
        </div>
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

      <div className="dashboard-charts-grid">
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
            {data.topPages.slice(0, 5).map((page, index) => (
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
            ))}
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
            {data.trafficSources.slice(0, 5).map((source, index) => (
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
            ))}
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
            {data.deviceBreakdown.slice(0, 5).map((device, index) => (
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
            ))}
          </div>
        </div>
      </div>

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


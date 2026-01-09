import React from 'react';
import './DashboardModal.css';

const DashboardModal = ({ isOpen, onClose, title, data, type }) => {
  if (!isOpen) return null;

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('fr-CA').format(num);
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return '0.0';
    return value.toFixed(1);
  };

  const renderContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className="modal-empty">
          <p>Aucune donnée disponible</p>
        </div>
      );
    }

    switch (type) {
      case 'topPages':
        return (
          <div className="modal-list">
            {data.map((page, index) => (
              <div key={index} className="modal-item modal-page-item">
                <div className="modal-rank">#{index + 1}</div>
                <div className="modal-item-content">
                  <div className="modal-item-header">
                    <span className="modal-item-title">{page.path || '/'}</span>
                    <span className="modal-item-secondary">{formatNumber(page.views)} vues</span>
                  </div>
                  {page.change !== undefined && (
                    <div className="modal-item-change">
                      <span className={page.change >= 0 ? 'positive' : 'negative'}>
                        {page.change >= 0 ? '↑' : '↓'} {Math.abs(page.change).toFixed(1)}%
                      </span>
                      <span className="modal-change-label">vs période précédente</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'trafficSources':
        return (
          <div className="modal-list">
            {data.map((source, index) => (
              <div key={index} className="modal-item modal-source-item">
                <div className="modal-item-header">
                  <span className="modal-item-title">{source.source}</span>
                  <span className="modal-item-percentage">{formatPercentage(source.percentage)}%</span>
                </div>
                <div className="modal-bar-container">
                  <div 
                    className="modal-bar" 
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <div className="modal-item-stats">
                  <span>{formatNumber(source.sessions)} sessions</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'deviceBreakdown':
        return (
          <div className="modal-list">
            {data.map((device, index) => (
              <div key={index} className="modal-item modal-device-item">
                <div className="modal-item-header">
                  <span className="modal-item-title">{device.device}</span>
                  <span className="modal-item-percentage">{formatPercentage(device.percentage)}%</span>
                </div>
                <div className="modal-bar-container">
                  <div 
                    className="modal-bar" 
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                </div>
                <div className="modal-item-stats">
                  <span>{formatNumber(device.sessions)} sessions</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'realtimeActivePages':
        return (
          <div className="modal-list">
            {data.map((page, index) => (
              <div key={index} className="modal-item modal-page-item">
                <div className="modal-rank">#{index + 1}</div>
                <div className="modal-item-content">
                  <div className="modal-item-header">
                    <span className="modal-item-title" title={page.title}>{page.path || '/'}</span>
                    <span className="modal-item-secondary" style={{ color: '#28a745', fontWeight: '600' }}>
                      👥 {formatNumber(page.activeUsers)} actifs
                    </span>
                  </div>
                  {page.title && (
                    <div className="modal-item-change">
                      <span className="modal-change-label">{page.title}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'realtimeLocations':
        return (
          <div className="modal-list">
            {data.map((location, index) => {
              const totalUsers = data.reduce((sum, loc) => sum + loc.activeUsers, 0);
              const percentage = totalUsers > 0 ? (location.activeUsers / totalUsers) * 100 : 0;
              return (
                <div key={index} className="modal-item modal-source-item">
                  <div className="modal-item-header">
                    <span className="modal-item-title">🌍 {location.location}</span>
                    <span className="modal-item-percentage">{formatPercentage(percentage)}%</span>
                  </div>
                  <div className="modal-bar-container">
                    <div 
                      className="modal-bar" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="modal-item-stats">
                    <span>{formatNumber(location.activeUsers)} utilisateurs actifs</span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'realtimeTrafficSources':
        return (
          <div className="modal-list">
            {data.map((source, index) => (
              <div key={index} className="modal-item modal-source-item">
                <div className="modal-item-header">
                  <span className="modal-item-title">{source.source}</span>
                  <span className="modal-item-percentage">{formatPercentage(source.percentage)}%</span>
                </div>
                <div className="modal-bar-container">
                  <div 
                    className="modal-bar" 
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <div className="modal-item-stats">
                  <span>{formatNumber(source.activeUsers)} utilisateurs actifs</span>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="modal-body">
          {renderContent()}
        </div>
        <div className="modal-footer">
          <button className="modal-btn-close" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;


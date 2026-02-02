// Google Analytics 4 API Service - Real Integration
// Uses OAuth token from Google Sign-In to access GA4 data

const GA4_API_BASE = 'https://analyticsdata.googleapis.com/v1beta';

const OAUTH_SCOPE =
  'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/analytics.readonly';

/**
 * Request a fresh OAuth access token (silent) from Google Identity Services.
 * Returns the new token or null if refresh fails or times out.
 */
const refreshOAuthToken = () =>
  new Promise((resolve) => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (
      !clientId ||
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.oauth2
    ) {
      resolve(null);
      return;
    }
    let settled = false;
    const done = (token) => {
      if (settled) return;
      settled = true;
      resolve(token);
    };
    const timeout = setTimeout(() => done(null), 5000);
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: OAUTH_SCOPE,
        callback: (tokenResponse) => {
          clearTimeout(timeout);
          if (tokenResponse && tokenResponse.access_token) {
            done(tokenResponse.access_token);
          } else {
            done(null);
          }
        },
      });
      tokenClient.requestAccessToken({ prompt: '' });
    } catch {
      clearTimeout(timeout);
      done(null);
    }
  });

/**
 * Get access token: try silent refresh first, then use stored token.
 * GA4 Data API requires a valid OAuth 2 access token (not JWT).
 */
const getAccessToken = async () => {
  const authData = localStorage.getItem('dashboard_auth');
  if (!authData) {
    throw new Error('Not authenticated');
  }

  const auth = JSON.parse(authData);

  // Try to get a fresh OAuth token (silent) so we don't use an expired one
  const freshToken = await refreshOAuthToken();
  if (freshToken) {
    const updated = { ...auth, accessToken: freshToken };
    try {
      localStorage.setItem('dashboard_auth', JSON.stringify(updated));
    } catch (_) {}
    return freshToken;
  }

  // Use stored OAuth access token
  if (auth.accessToken) {
    return auth.accessToken;
  }

  // Fallback to JWT does not work for GA4 Data API
  if (auth.token) {
    throw new Error(
      'OAuth access token missing or expired. Please sign out and sign in again with Google, and accept "See your Google Analytics data".'
    );
  }

  throw new Error('No access token available. Please sign in again.');
};

/**
 * Request a new OAuth access token with GA4 scope (shows consent screen).
 * Use when the user sees "Authentication failed" to force a fresh token.
 * Updates localStorage and returns the new access token, or null on failure.
 */
export const requestGa4Consent = () =>
  new Promise((resolve) => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (
      !clientId ||
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.oauth2
    ) {
      resolve(null);
      return;
    }
    let settled = false;
    const done = (token) => {
      if (settled) return;
      settled = true;
      resolve(token);
    };
    const timeout = setTimeout(() => done(null), 60000);
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: OAUTH_SCOPE,
        callback: (tokenResponse) => {
          clearTimeout(timeout);
          if (tokenResponse && tokenResponse.access_token) {
            const authData = localStorage.getItem('dashboard_auth');
            if (authData) {
              try {
                const auth = JSON.parse(authData);
                const updated = { ...auth, accessToken: tokenResponse.access_token };
                localStorage.setItem('dashboard_auth', JSON.stringify(updated));
              } catch (_) {}
            }
            done(tokenResponse.access_token);
          } else {
            done(null);
          }
        },
      });
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch {
      clearTimeout(timeout);
      done(null);
    }
  });

/**
 * Exchange JWT for OAuth access token
 * This should be done on a backend server in production
 */
const exchangeJWTForAccessToken = async (jwtToken) => {
  try {
    // In a real implementation, you would:
    // 1. Send JWT to your backend
    // 2. Backend verifies JWT and exchanges it for OAuth access token
    // 3. Return access token with analytics.readonly scope
    
    // For now, we'll try to use the JWT directly
    // This requires the JWT to have been issued with the right scopes
    return jwtToken;
  } catch (error) {
    console.error('Error exchanging JWT for access token:', error);
    throw error;
  }
};

/**
 * Make authenticated request to GA4 API
 * Note: This requires the Google Sign-In to have the analytics.readonly scope
 * In production, you should use a backend to exchange JWT for OAuth access token
 */
// GA4 API expects properties/{id}:runReport (colon, not slash)
const normalizePropertyId = (id) => {
  if (!id || typeof id !== 'string') return id;
  return id.replace(/^properties\/?/i, '').trim();
};

const makeGA4Request = async (endpoint, body) => {
  const rawId = process.env.REACT_APP_GA4_PROPERTY_ID;
  if (!rawId) {
    throw new Error('GA4 Property ID not configured');
  }
  const propertyId = normalizePropertyId(rawId);

  try {
    const accessToken = await getAccessToken();
    const url = `${GA4_API_BASE}/properties/${propertyId}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
      
      // If 401/403, it's likely an authentication issue
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed: ${errorMessage}. Please ensure your Google account has access to GA4 property ${propertyId} and the analytics.readonly scope is granted.`);
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('GA4 API Error:', error);
    
    if (error.message.includes('Authentication failed')) {
      throw error;
    }
    if (error.message.includes('Property ID not configured')) {
      throw error;
    }
    // Network/CORS or other: give a hint
    const hint = (error.message || '').toLowerCase().includes('fetch') || (error.message || '').toLowerCase().includes('load')
      ? ' Vérifiez que https://stats.lasoireedurire.ca est dans les « Origines JavaScript autorisées » du client OAuth (Google Cloud Console) et reconnectez-vous.'
      : '';
    throw new Error(`Failed to fetch GA4 data: ${error.message}${hint}`);
  }
};

/**
 * Fetch analytics data from GA4
 */
export const fetchAnalyticsData = async (config) => {
  const { startDate, endDate, metrics = [], dimensions = [], orderBys = [] } = config;

  const requestBody = {
    dateRanges: [
      {
        startDate: startDate,
        endDate: endDate,
      },
    ],
    metrics: metrics.map(metric => ({ name: metric })),
    dimensions: dimensions.map(dimension => ({ name: dimension })),
    ...(orderBys.length > 0 && { orderBys }),
    limit: config.limit || 100,
  };

  try {
    const data = await makeGA4Request(':runReport', requestBody);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fetch real-time analytics data from GA4 (for today's data)
 */
export const fetchRealtimeAnalyticsData = async (config) => {
  const { metrics = [], dimensions = [], orderBys = [] } = config;

  const requestBody = {
    metrics: metrics.map(metric => ({ name: metric })),
    dimensions: dimensions.map(dimension => ({ name: dimension })),
    ...(orderBys.length > 0 && { orderBys }),
    limit: config.limit || 100,
  };

  try {
    const data = await makeGA4Request(':runRealtimeReport', requestBody);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get users metric with comparison
 */
export const getUsers = async (propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime = false) => {
  // Current period - use Real-time API if requested
  const currentResult = useRealtime 
    ? await fetchRealtimeAnalyticsData({
        metrics: ['activeUsers'],
      })
    : await fetchAnalyticsData({
        startDate,
        endDate,
        metrics: ['activeUsers'],
      });

  // Previous period for comparison (always use standard API)
  const previousResult = await fetchAnalyticsData({
    startDate: previousStartDate,
    endDate: previousEndDate,
    metrics: ['activeUsers'],
  });

  if (!currentResult.success || !previousResult.success) {
    const msg = currentResult.error || previousResult.error || 'Unknown error';
    throw new Error(`Failed to fetch users data: ${msg}`);
  }

  const current = parseInt(currentResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  const previous = parseInt(previousResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    current,
    previous,
    change: parseFloat(change.toFixed(1)),
  };
};

/**
 * Get sessions metric with comparison
 */
export const getSessions = async (propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime = false) => {
  const currentResult = useRealtime
    ? await fetchRealtimeAnalyticsData({
        metrics: ['sessions'],
      })
    : await fetchAnalyticsData({
        startDate,
        endDate,
        metrics: ['sessions'],
      });

  const previousResult = await fetchAnalyticsData({
    startDate: previousStartDate,
    endDate: previousEndDate,
    metrics: ['sessions'],
  });

  if (!currentResult.success || !previousResult.success) {
    const msg = currentResult.error || previousResult.error || 'Unknown error';
    throw new Error(`Failed to fetch sessions data: ${msg}`);
  }

  const current = parseInt(currentResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  const previous = parseInt(previousResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    current,
    previous,
    change: parseFloat(change.toFixed(1)),
  };
};

/**
 * Get page views metric with comparison
 */
export const getPageViews = async (propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime = false) => {
  const currentResult = useRealtime
    ? await fetchRealtimeAnalyticsData({
        metrics: ['screenPageViews'],
      })
    : await fetchAnalyticsData({
        startDate,
        endDate,
        metrics: ['screenPageViews'],
      });

  const previousResult = await fetchAnalyticsData({
    startDate: previousStartDate,
    endDate: previousEndDate,
    metrics: ['screenPageViews'],
  });

  if (!currentResult.success || !previousResult.success) {
    throw new Error('Failed to fetch page views data');
  }

  const current = parseInt(currentResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  const previous = parseInt(previousResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    current,
    previous,
    change: parseFloat(change.toFixed(1)),
  };
};

/**
 * Get bounce rate metric with comparison
 * Note: bounceRate is not available in Real-time API, so we use standard API even for today
 */
export const getBounceRate = async (propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime = false) => {
  // bounceRate is not available in Real-time API, always use standard API
  const currentResult = await fetchAnalyticsData({
    startDate,
    endDate,
    metrics: ['bounceRate'],
  });

  const previousResult = await fetchAnalyticsData({
    startDate: previousStartDate,
    endDate: previousEndDate,
    metrics: ['bounceRate'],
  });

  if (!currentResult.success || !previousResult.success) {
    const msg = currentResult.error || previousResult.error || 'Unknown error';
    throw new Error(`Failed to fetch bounce rate data: ${msg}`);
  }

  const current = parseFloat(currentResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0');
  const previous = parseFloat(previousResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0');
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    current: current * 100, // Convert to percentage
    previous: previous * 100,
    change: parseFloat(change.toFixed(1)),
  };
};

/**
 * Get average session duration with comparison
 * Note: averageSessionDuration is not available in Real-time API, so we use standard API even for today
 */
export const getAvgSessionDuration = async (propertyId, startDate, endDate, previousStartDate, previousEndDate, useRealtime = false) => {
  // averageSessionDuration is not available in Real-time API, always use standard API
  const currentResult = await fetchAnalyticsData({
    startDate,
    endDate,
    metrics: ['averageSessionDuration'],
  });

  const previousResult = await fetchAnalyticsData({
    startDate: previousStartDate,
    endDate: previousEndDate,
    metrics: ['averageSessionDuration'],
  });

  if (!currentResult.success || !previousResult.success) {
    throw new Error('Failed to fetch session duration data');
  }

  const currentSeconds = parseFloat(currentResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0');
  const previousSeconds = parseFloat(previousResult.data?.rows?.[0]?.metricValues?.[0]?.value || '0');
  
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const change = previousSeconds > 0 ? ((currentSeconds - previousSeconds) / previousSeconds) * 100 : 0;

  return {
    current: formatDuration(currentSeconds),
    previous: formatDuration(previousSeconds),
    change: parseFloat(change.toFixed(1)),
  };
};

/**
 * Get top pages
 */
export const getTopPages = async (propertyId, startDate, endDate, limit = 10, useRealtime = false) => {
  const result = useRealtime
    ? await fetchRealtimeAnalyticsData({
        metrics: ['screenPageViews'],
        dimensions: ['pagePath'],
        orderBys: [
          {
            metric: {
              metricName: 'screenPageViews',
            },
            desc: true,
          },
        ],
        limit,
      })
    : await fetchAnalyticsData({
        startDate,
        endDate,
        metrics: ['screenPageViews'],
        dimensions: ['pagePath'],
        orderBys: [
          {
            metric: {
              metricName: 'screenPageViews',
            },
            desc: true,
          },
        ],
        limit,
      });

  if (!result.success) {
    throw new Error(`Failed to fetch top pages data: ${result.error || 'Unknown error'}`);
  }

  const rows = result.data?.rows || [];
  return rows.map((row, index) => {
    const path = row.dimensionValues?.[0]?.value || '/';
    const views = parseInt(row.metricValues?.[0]?.value || '0', 10);
    
    // For now, we'll set change to 0 as we'd need previous period data
    // In a full implementation, you'd compare with previous period
    return {
      path,
      views,
      change: 0, // Would need to fetch previous period for comparison
    };
  });
};

/**
 * Get traffic sources
 */
export const getTrafficSources = async (propertyId, startDate, endDate, useRealtime = false) => {
  const result = useRealtime
    ? await fetchRealtimeAnalyticsData({
        metrics: ['activeUsers'], // Real-time uses activeUsers instead of sessions
        dimensions: ['sessionSource'],
        orderBys: [
          {
            metric: {
              metricName: 'activeUsers',
            },
            desc: true,
          },
        ],
        limit: 10,
      })
    : await fetchAnalyticsData({
        startDate,
        endDate,
        metrics: ['sessions'],
        dimensions: ['sessionSource'],
        orderBys: [
          {
            metric: {
              metricName: 'sessions',
            },
            desc: true,
          },
        ],
        limit: 10,
      });

  if (!result.success) {
    throw new Error('Failed to fetch traffic sources data');
  }

  const rows = result.data?.rows || [];
  const totalSessions = rows.reduce((sum, row) => {
    return sum + parseInt(row.metricValues?.[0]?.value || '0', 10);
  }, 0);

  return rows.map((row) => {
    const source = row.dimensionValues?.[0]?.value || 'Unknown';
    const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10);
    const percentage = totalSessions > 0 ? (sessions / totalSessions) * 100 : 0;

    return {
      source: source === '(direct)' ? 'Direct' : source,
      sessions,
      percentage: parseFloat(percentage.toFixed(1)),
    };
  });
};

/**
 * Get device breakdown
 */
export const getDeviceBreakdown = async (propertyId, startDate, endDate, useRealtime = false) => {
  const result = useRealtime
    ? await fetchRealtimeAnalyticsData({
        metrics: ['activeUsers'], // Real-time uses activeUsers instead of sessions
        dimensions: ['deviceCategory'],
        orderBys: [
          {
            metric: {
              metricName: 'activeUsers',
            },
            desc: true,
          },
        ],
      })
    : await fetchAnalyticsData({
        startDate,
        endDate,
        metrics: ['sessions'],
        dimensions: ['deviceCategory'],
        orderBys: [
          {
            metric: {
              metricName: 'sessions',
            },
            desc: true,
          },
        ],
      });

  if (!result.success) {
    throw new Error(`Failed to fetch device breakdown data: ${result.error || 'Unknown error'}`);
  }

  const rows = result.data?.rows || [];
  const totalSessions = rows.reduce((sum, row) => {
    return sum + parseInt(row.metricValues?.[0]?.value || '0', 10);
  }, 0);

  return rows.map((row) => {
    const device = row.dimensionValues?.[0]?.value || 'Unknown';
    const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10);
    const percentage = totalSessions > 0 ? (sessions / totalSessions) * 100 : 0;

    return {
      device: device.charAt(0).toUpperCase() + device.slice(1).toLowerCase(),
      sessions,
      percentage: parseFloat(percentage.toFixed(1)),
    };
  });
};

/**
 * Get real-time active pages (pages currently being viewed)
 * Note: propertyId is not needed as it's retrieved from process.env in makeGA4Request
 */
export const getRealtimeActivePages = async (limit = 10) => {
  const result = await fetchRealtimeAnalyticsData({
    metrics: ['activeUsers'],
    dimensions: ['pagePath', 'pageTitle'],
    orderBys: [
      {
        metric: {
          metricName: 'activeUsers',
        },
        desc: true,
      },
    ],
    limit,
  });

  if (!result.success) {
    throw new Error(`Failed to fetch real-time active pages: ${result.error || 'Unknown error'}`);
  }

  const rows = result.data?.rows || [];
  return rows.map((row) => {
    const path = row.dimensionValues?.[0]?.value || '/';
    const title = row.dimensionValues?.[1]?.value || 'Sans titre';
    const activeUsers = parseInt(row.metricValues?.[0]?.value || '0', 10);

    return {
      path,
      title,
      activeUsers,
    };
  });
};

/**
 * Get real-time user locations (countries/cities of active users)
 * Note: propertyId is not needed as it's retrieved from process.env in makeGA4Request
 */
export const getRealtimeUserLocations = async (limit = 10) => {
  const result = await fetchRealtimeAnalyticsData({
    metrics: ['activeUsers'],
    dimensions: ['country', 'city'],
    orderBys: [
      {
        metric: {
          metricName: 'activeUsers',
        },
        desc: true,
      },
    ],
    limit,
  });

  if (!result.success) {
    throw new Error(`Failed to fetch real-time user locations: ${result.error || 'Unknown error'}`);
  }

  const rows = result.data?.rows || [];
  return rows.map((row) => {
    const country = row.dimensionValues?.[0]?.value || 'Inconnu';
    const city = row.dimensionValues?.[1]?.value || 'Inconnu';
    const activeUsers = parseInt(row.metricValues?.[0]?.value || '0', 10);

    return {
      country,
      city,
      activeUsers,
      location: city !== 'Inconnu' ? `${city}, ${country}` : country,
    };
  });
};

/**
 * Get real-time traffic sources (where current active users came from)
 * Note: propertyId is not needed as it's retrieved from process.env in makeGA4Request
 */
export const getRealtimeTrafficSources = async (limit = 10) => {
  const result = await fetchRealtimeAnalyticsData({
    metrics: ['activeUsers'],
    dimensions: ['sessionSource', 'sessionMedium'],
    orderBys: [
      {
        metric: {
          metricName: 'activeUsers',
        },
        desc: true,
      },
    ],
    limit,
  });

  if (!result.success) {
    throw new Error(`Failed to fetch real-time traffic sources: ${result.error || 'Unknown error'}`);
  }

  const rows = result.data?.rows || [];
  const totalUsers = rows.reduce((sum, row) => {
    return sum + parseInt(row.metricValues?.[0]?.value || '0', 10);
  }, 0);

  return rows.map((row) => {
    const source = row.dimensionValues?.[0]?.value || '(direct)';
    const medium = row.dimensionValues?.[1]?.value || 'none';
    const activeUsers = parseInt(row.metricValues?.[0]?.value || '0', 10);
    const percentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    const sourceLabel = source === '(direct)' ? 'Direct' : source;
    const mediumLabel = medium !== 'none' ? ` (${medium})` : '';

    return {
      source: sourceLabel + mediumLabel,
      activeUsers,
      percentage: parseFloat(percentage.toFixed(1)),
    };
  });
};

/**
 * Helper function to format date range
 */
export const getDateRange = (range) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const ranges = {
    today: {
      start: today,
      end: today,
      previous: {
        start: new Date(today.getTime() - 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() - 24 * 60 * 60 * 1000),
      },
    },
    last7days: {
      start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: today,
      previous: {
        start: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    last30days: {
      start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      end: today,
      previous: {
        start: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    last90days: {
      start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
      end: today,
      previous: {
        start: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
      },
    },
    last365days: {
      start: new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000),
      end: today,
      previous: {
        start: new Date(today.getTime() - 730 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000),
      },
    },
  };

  const selected = ranges[range] || ranges.last30days;
  
  return {
    startDate: selected.start.toISOString().split('T')[0],
    endDate: selected.end.toISOString().split('T')[0],
    previousStartDate: selected.previous.start.toISOString().split('T')[0],
    previousEndDate: selected.previous.end.toISOString().split('T')[0],
  };
};


// Google Analytics 4 API Service - Real Integration
// Uses OAuth token from Google Sign-In to access GA4 data

const GA4_API_BASE = 'https://analyticsdata.googleapis.com/v1beta';

/**
 * Get access token from Google Sign-In authentication
 * Uses OAuth access token if available, otherwise falls back to JWT (which won't work for GA4)
 */
const getAccessToken = async () => {
  // Get the stored auth data from localStorage
  const authData = localStorage.getItem('dashboard_auth');
  if (!authData) {
    throw new Error('Not authenticated');
  }

  const auth = JSON.parse(authData);
  
  // Use OAuth access token if available (has analytics.readonly scope)
  if (auth.accessToken) {
    return auth.accessToken;
  }

  // Fallback to JWT token (won't work for GA4 API, but provides better error message)
  if (auth.token) {
    console.warn('⚠️ Using JWT token instead of OAuth access token. GA4 API calls may fail.');
    console.warn('⚠️ Please ensure OAuth access token is obtained during login.');
    return auth.token;
  }

  throw new Error('No access token available');
};

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
const makeGA4Request = async (endpoint, body) => {
  const propertyId = process.env.REACT_APP_GA4_PROPERTY_ID;
  if (!propertyId) {
    throw new Error('GA4 Property ID not configured');
  }

  try {
    // Get JWT token from Google Sign-In
    const jwtToken = await getAccessToken();
    
    // Try to use JWT directly - this may work if the JWT has the right scopes
    // If not, you'll need to implement a backend endpoint to exchange JWT for OAuth token
    const response = await fetch(`${GA4_API_BASE}/properties/${propertyId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
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
    
    // Provide helpful error messages
    if (error.message.includes('Authentication failed')) {
      throw error;
    }
    
    throw new Error(`Failed to fetch GA4 data: ${error.message}`);
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
 * Get users metric with comparison
 */
export const getUsers = async (propertyId, startDate, endDate, previousStartDate, previousEndDate) => {
  // Current period
  const currentResult = await fetchAnalyticsData({
    startDate,
    endDate,
    metrics: ['activeUsers'],
  });

  // Previous period for comparison
  const previousResult = await fetchAnalyticsData({
    startDate: previousStartDate,
    endDate: previousEndDate,
    metrics: ['activeUsers'],
  });

  if (!currentResult.success || !previousResult.success) {
    throw new Error('Failed to fetch users data');
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
export const getSessions = async (propertyId, startDate, endDate, previousStartDate, previousEndDate) => {
  const currentResult = await fetchAnalyticsData({
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
    throw new Error('Failed to fetch sessions data');
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
export const getPageViews = async (propertyId, startDate, endDate, previousStartDate, previousEndDate) => {
  const currentResult = await fetchAnalyticsData({
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
 */
export const getBounceRate = async (propertyId, startDate, endDate, previousStartDate, previousEndDate) => {
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
    throw new Error('Failed to fetch bounce rate data');
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
 */
export const getAvgSessionDuration = async (propertyId, startDate, endDate, previousStartDate, previousEndDate) => {
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
export const getTopPages = async (propertyId, startDate, endDate, limit = 10) => {
  const result = await fetchAnalyticsData({
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
    throw new Error('Failed to fetch top pages data');
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
export const getTrafficSources = async (propertyId, startDate, endDate) => {
  const result = await fetchAnalyticsData({
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
export const getDeviceBreakdown = async (propertyId, startDate, endDate) => {
  const result = await fetchAnalyticsData({
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
    throw new Error('Failed to fetch device breakdown data');
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
 * Helper function to format date range
 */
export const getDateRange = (range) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const ranges = {
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


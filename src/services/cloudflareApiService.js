// Cloudflare API Service
// Handles communication with Cloudflare Workers API for access requests

const getApiBaseUrl = () => {
  // In production, use the actual domain
  if (process.env.NODE_ENV === 'production') {
    return 'https://lasoireedurire.ca';
  }
  // In development, use localhost or a test endpoint
  // For now, we'll use the production URL as fallback
  return process.env.REACT_APP_CLOUDFLARE_API_URL || 'https://lasoireedurire.ca';
};

/**
 * Create an access request
 */
export const createAccessRequest = async (email, name, picture, token, expiresAt) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/access-requests`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        picture,
        token,
        expiresAt,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating access request:', error);
    throw error;
  }
};

/**
 * Get access requests by email
 */
export const getAccessRequest = async (email) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/access-requests?email=${encodeURIComponent(email)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data && data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching access request:', error);
    throw error;
  }
};

/**
 * Get all access requests by status
 */
export const getAccessRequestsByStatus = async (status) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/access-requests?status=${status}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching access requests:', error);
    throw error;
  }
};

/**
 * Update access request status
 */
export const updateAccessRequestStatus = async (email, status, reviewedBy = null) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/access-requests`;
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        status,
        reviewedBy,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating access request:', error);
    throw error;
  }
};

/**
 * Delete access request
 */
export const deleteAccessRequest = async (email) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/access-requests?email=${encodeURIComponent(email)}`;
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting access request:', error);
    throw error;
  }
};

/**
 * Verify token
 */
export const verifyToken = async (email, token) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/verify-token?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

/**
 * Get all dashboard users
 */
export const getAllUsers = async () => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/users`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get all access requests
 */
export const getAllAccessRequests = async () => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/access-requests`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching access requests:', error);
    throw error;
  }
};

/**
 * Create a new dashboard user
 */
export const createUser = async (email, password, name, isAdmin = false) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/users`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        isAdmin,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update a dashboard user
 */
export const updateUser = async (id, updates) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/users`;
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...updates,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


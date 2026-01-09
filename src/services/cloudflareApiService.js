// Cloudflare API Service
// Handles communication with Cloudflare Workers API for access requests

const getApiBaseUrl = () => {
  // Always use the current origin to ensure we're hitting the right API
  // This works for both development and production
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for server-side rendering (shouldn't happen in this app)
  if (process.env.NODE_ENV === 'production') {
    return 'https://lasoireedurire.ca';
  }
  // Development fallback
  return process.env.REACT_APP_CLOUDFLARE_API_URL || 'http://localhost:3000';
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
    
    console.log('📡 Updating access request:', { email, status, reviewedBy, apiUrl });
    
    const requestBody = {
      email,
      status,
      reviewedBy,
    };
    
    console.log('📡 Request body:', requestBody);
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Response status:', response.status, response.statusText);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        console.error('❌ Error response text:', text);
        errorData = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
      console.error('❌ API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Update successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Error updating access request:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

/**
 * Delete access request
 */
export const deleteAccessRequest = async (email) => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/access-requests?email=${encodeURIComponent(email)}`;
    
    console.log('🗑️ Deleting access request:', { email, apiUrl });
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🗑️ Response status:', response.status, response.statusText);
    console.log('🗑️ Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        console.error('❌ Error response text:', text);
        errorData = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
      console.error('❌ API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Deletion successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Error deleting access request:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
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
    console.log('📡 Fetching users from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: errorText || 'Unknown error' };
      }
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response data:', data);
    const users = data.users || [];
    console.log('✅ Parsed users:', users);
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
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


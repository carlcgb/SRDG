// Subdomain Router Utility
// Detects subdomain and routes to appropriate app

export const getSubdomain = () => {
  const hostname = window.location.hostname;
  
  // Remove port if present
  const hostnameWithoutPort = hostname.split(':')[0];
  
  // Split by dots
  const parts = hostnameWithoutPort.split('.');
  
  // For localhost, check if there's a subdomain prefix
  if (hostnameWithoutPort === 'localhost' || hostnameWithoutPort === '127.0.0.1') {
    // Check if there's a subdomain in the path or query
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) {
      return 'dashboard';
    }
    return 'main';
  }
  
  // For production domains
  // If we have more than 2 parts (e.g., dashboard.lasoireedurire.ca), extract subdomain
  if (parts.length > 2) {
    return parts[0]; // e.g., 'dashboard' from 'dashboard.lasoireedurire.ca'
  }
  
  // Default to main site
  return 'main';
};

export const isDashboardSubdomain = () => {
  return getSubdomain() === 'dashboard';
};

